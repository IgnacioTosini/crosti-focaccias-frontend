import axios from "axios";
import type { FocacciaItem, FocacciaCreate } from "../types";
import { env } from "../config/env";

const BASE_URL_PRODUCT = env.VITE_BASE_URL || 'http://localhost:8080/api/focaccias';

// Configuración del caché
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos
const CACHE_PREFIX = 'crosti_focaccias_';
const FALLBACK_CACHE_PREFIX = 'crosti_fallback_'; // Caché sin expiración para fallback

// Estados del servidor
export const ServerStatus = {
    ACTIVE: 'active',
    HIBERNATING: 'hibernating',
    ERROR: 'error',
    UNKNOWN: 'unknown'
} as const;

export type ServerStatus = typeof ServerStatus[keyof typeof ServerStatus];

// Interfaz para los elementos del caché
interface CacheItem<T> {
    data: T;
    timestamp: number;
    hash: string;
    version: number;
}

// Clase para gestionar el caché persistente
class PersistentCache {
    private static instance: PersistentCache;
    private memoryCache = new Map<string, CacheItem<unknown>>();
    private cacheVersion = 1;
    private serverStatus: ServerStatus = ServerStatus.UNKNOWN;

    static getInstance(): PersistentCache {
        if (!PersistentCache.instance) {
            PersistentCache.instance = new PersistentCache();
        }
        return PersistentCache.instance;
    }

    // Generar hash simple de los datos
    private generateHash(data: unknown): string {
        return btoa(JSON.stringify(data)).slice(0, 16);
    }

    // Obtener del localStorage
    private getFromStorage(key: string): CacheItem<unknown> | null {
        try {
            const stored = localStorage.getItem(`${CACHE_PREFIX}${key}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Verificar versión del caché
                if (parsed.version === this.cacheVersion) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('Error reading from cache:', error);
        }
        return null;
    }

    // Guardar en localStorage
    private saveToStorage(key: string, item: CacheItem<unknown>): void {
        try {
            localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
            // Guardar también en caché de fallback (sin expiración)
            this.saveFallbackCache(key, item);
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }
    }

    // Guardar en caché de fallback (sin expiración)
    private saveFallbackCache(key: string, item: CacheItem<unknown>): void {
        try {
            const fallbackItem = { ...item, timestamp: Date.now() };
            localStorage.setItem(`${FALLBACK_CACHE_PREFIX}${key}`, JSON.stringify(fallbackItem));
        } catch (error) {
            console.warn('Error saving to fallback cache:', error);
        }
    }

    // Obtener del caché de fallback
    private getFallbackCache(key: string): CacheItem<unknown> | null {
        try {
            const stored = localStorage.getItem(`${FALLBACK_CACHE_PREFIX}${key}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.version === this.cacheVersion) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('Error reading from fallback cache:', error);
        }
        return null;
    }

    // Verificar si el caché es válido
    private isValid(item: CacheItem<unknown>): boolean {
        return Date.now() - item.timestamp < CACHE_DURATION;
    }

    // Obtener datos del caché
    get<T>(key: string): T | null {
        // Primero verificar memoria
        let cached = this.memoryCache.get(key) as CacheItem<T> | undefined;

        // Si no está en memoria, verificar localStorage
        if (!cached) {
            const storedData = this.getFromStorage(key);
            if (storedData && this.isValid(storedData)) {
                cached = storedData as CacheItem<T>;
                // Cargar en memoria desde localStorage
                this.memoryCache.set(key, cached);
            }
        }

        // Verificar si es válido
        if (cached && this.isValid(cached)) {
            return cached.data;
        }

        return null;
    }

    // Obtener datos del caché, incluso si expiraron (para fallback)
    getStale<T>(key: string): T | null {
        // Primero intentar caché normal
        let cached = this.memoryCache.get(key) as CacheItem<T> | undefined;

        if (!cached) {
            cached = this.getFromStorage(key) as CacheItem<T> | undefined;
        }

        // Si hay datos en caché normal (aunque expirados), usarlos
        if (cached) {
            return cached.data;
        }

        // Si no, intentar caché de fallback
        const fallbackData = this.getFallbackCache(key);
        if (fallbackData) {
            return fallbackData.data as T;
        }

        return null;
    }

    // Guardar datos en el caché
    set<T>(key: string, data: T): void {
        const hash = this.generateHash(data);
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            hash,
            version: this.cacheVersion
        };

        this.memoryCache.set(key, item);
        this.saveToStorage(key, item);
    }

    // Verificar si los datos han cambiado
    hasChanged<T>(key: string, newData: T): boolean {
        const cached = this.get<T>(key);
        if (!cached) return true;

        const cachedItem = this.memoryCache.get(key) || this.getFromStorage(key);
        if (!cachedItem) return true;

        const newHash = this.generateHash(newData);
        return cachedItem.hash !== newHash;
    }

    // Limpiar caché específico
    delete(key: string): void {
        this.memoryCache.delete(key);
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }

    // Limpiar todo el caché
    clear(): void {
        this.memoryCache.clear();
        // Limpiar solo las claves que empiecen con nuestro prefijo
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Limpiar caché de fallback
    clearFallback(): void {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(FALLBACK_CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Obtener y establecer estado del servidor
    getServerStatus(): ServerStatus {
        return this.serverStatus;
    }

    setServerStatus(status: ServerStatus): void {
        this.serverStatus = status;
        // Emitir evento de cambio de estado
        window.dispatchEvent(new CustomEvent('serverStatusChanged', {
            detail: { status }
        }));
    }

    // Obtener información del caché para debugging
    getCacheInfo(): { keys: string[]; memorySize: number; storageSize: number; fallbackSize: number; serverStatus: ServerStatus } {
        const keys = Array.from(this.memoryCache.keys());
        const storageKeys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
        const fallbackKeys = Object.keys(localStorage).filter(key => key.startsWith(FALLBACK_CACHE_PREFIX));

        return {
            keys,
            memorySize: this.memoryCache.size,
            storageSize: storageKeys.length,
            fallbackSize: fallbackKeys.length,
            serverStatus: this.serverStatus
        };
    }
}

// Instancia singleton del caché
const cache = PersistentCache.getInstance();

// Utilidad para obtener apiKey de la URL
export function getApiKeyFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('apiKey');
}

// Función para limpiar el caché cuando se modifiquen los datos
function clearProductCache(): void {
    cache.delete('focaccias');
    cache.delete('featuredFocaccias');
}

export class ProductService {

    static async createFocaccia(focacciaData: FocacciaCreate) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}?apiKey=${encodeURIComponent(apiKey)}` : BASE_URL_PRODUCT;
        const response = await axios.post(url, focacciaData);

        // Limpiar caché después de crear
        clearProductCache();

        return response.data;
    }

    static async getFocaccias() {
        const cacheKey = 'focaccias';

        // Intentar obtener del caché primero
        const cachedData = cache.get<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
        if (cachedData) {
            // Datos desde caché, verificar si necesitamos actualizar en segundo plano
            this.checkForUpdatesInBackground(cacheKey);
            cache.setServerStatus(ServerStatus.ACTIVE);
            return cachedData;
        }

        // Si no hay caché, hacer petición normal
        try {
            const response = await axios.get(BASE_URL_PRODUCT, {
                timeout: 10000 // 10 segundos de timeout
            });

            // Guardar en caché la respuesta
            cache.set(cacheKey, response.data);
            cache.setServerStatus(ServerStatus.ACTIVE);

            return response.data;
        } catch (error: unknown) {
            // Si falla la petición, intentar usar caché expirado
            const staleData = cache.getStale<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
            
            if (staleData) {
                console.warn('Servidor no disponible, usando datos en caché');
                cache.setServerStatus(ServerStatus.HIBERNATING);
                
                // Emitir evento para notificar que estamos usando datos cacheados
                window.dispatchEvent(new CustomEvent('usingCachedData', {
                    detail: { 
                        message: 'Mostrando datos guardados - el servidor se está iniciando...',
                        cacheKey,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }));
                
                return {
                    ...staleData,
                    fromCache: true,
                    cacheWarning: 'Datos del caché - servidor hibernando'
                };
            }
            
            // Si no hay datos en caché, lanzar el error
            cache.setServerStatus(ServerStatus.ERROR);
            throw error;
        }
    }

    // Nuevo método para carga por lotes - obtener solo los primeros productos
    static async getFocacciasBatch(limit?: number) {
        const cacheKey = limit ? `focaccias_batch_${limit}` : 'focaccias_batch';

        // Intentar obtener del caché primero
        const cachedData = cache.get<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
        if (cachedData) {
            cache.setServerStatus(ServerStatus.ACTIVE);
            return cachedData;
        }

        try {
            // Construir URL con limit si se proporciona
            const url = limit ? `${BASE_URL_PRODUCT}?limit=${limit}` : BASE_URL_PRODUCT;
            const response = await axios.get(url, { timeout: 10000 });

            // Si es un lote limitado, no guardar en caché principal
            if (limit) {
                cache.set(cacheKey, response.data);
            } else {
                // Si es carga completa, guardar en caché principal también
                cache.set('focaccias', response.data);
                cache.set(cacheKey, response.data);
            }

            cache.setServerStatus(ServerStatus.ACTIVE);
            return response.data;
        } catch (error: unknown) {
            // Intentar usar datos cacheados aunque estén expirados
            const staleData = cache.getStale<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
            
            if (staleData) {
                console.warn('Servidor no disponible, usando datos en caché para batch');
                cache.setServerStatus(ServerStatus.HIBERNATING);
                
                window.dispatchEvent(new CustomEvent('usingCachedData', {
                    detail: { 
                        message: 'Mostrando datos guardados - el servidor se está iniciando...',
                        cacheKey,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }));
                
                return {
                    ...staleData,
                    fromCache: true,
                    cacheWarning: 'Datos del caché - servidor hibernando'
                };
            }
            
            cache.setServerStatus(ServerStatus.ERROR);
            throw error;
        }
    }

    // Método para verificar actualizaciones en segundo plano
    private static async checkForUpdatesInBackground(cacheKey: string) {
        try {
            const response = await axios.get(BASE_URL_PRODUCT);

            // Verificar si los datos han cambiado
            if (cache.hasChanged(cacheKey, response.data)) {
                // Actualizar caché con nuevos datos
                cache.set(cacheKey, response.data);

                // Disparar evento personalizado para notificar cambios
                window.dispatchEvent(new CustomEvent('focacciaDataUpdated', {
                    detail: { data: response.data, cacheKey }
                }));
            }
        } catch (error) {
            console.warn('Error checking for updates in background:', error);
        }
    }

    static async getFocacciaById(id: number) {
        const cacheKey = `focaccia_${id}`;

        // Intentar obtener del caché primero
        const cachedData = cache.get<{ data: FocacciaItem; message: string; success: boolean }>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const response = await axios.get(`${BASE_URL_PRODUCT}/${id}`);

        // Guardar en caché individual
        cache.set(cacheKey, response.data);

        return response.data;
    }

    static async updateFocaccia(id: number, focacciaData: FocacciaItem) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL_PRODUCT}/${id}`;
        const response = await axios.put(url, focacciaData);

        // Limpiar caché después de actualizar
        clearProductCache();
        cache.delete(`focaccia_${id}`);

        return response.data;
    }

    static async deleteFocaccia(id: number) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL_PRODUCT}/${id}`;
        const response = await axios.delete(url);

        // Limpiar caché después de eliminar
        clearProductCache();
        cache.delete(`focaccia_${id}`);

        return response.data;
    }

    static async getFeaturedFocaccias() {
        const cacheKey = 'featuredFocaccias';

        // Intentar obtener del caché primero
        const cachedData = cache.get<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
        if (cachedData) {
            // Verificar actualizaciones en segundo plano
            this.checkForFeaturedUpdatesInBackground(cacheKey);
            cache.setServerStatus(ServerStatus.ACTIVE);
            return cachedData;
        }

        try {
            // Si no hay caché, hacer petición normal
            const response = await axios.get(`${BASE_URL_PRODUCT}/featured`, { timeout: 10000 });

            // Guardar en caché la respuesta
            cache.set(cacheKey, response.data);
            cache.setServerStatus(ServerStatus.ACTIVE);

            return response.data;
        } catch (error: unknown) {
            // Intentar usar datos cacheados aunque estén expirados
            const staleData = cache.getStale<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
            
            if (staleData) {
                console.warn('Servidor no disponible, usando datos destacados en caché');
                cache.setServerStatus(ServerStatus.HIBERNATING);
                
                window.dispatchEvent(new CustomEvent('usingCachedData', {
                    detail: { 
                        message: 'Mostrando productos destacados guardados - el servidor se está iniciando...',
                        cacheKey,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }));
                
                return {
                    ...staleData,
                    fromCache: true,
                    cacheWarning: 'Datos del caché - servidor hibernando'
                };
            }
            
            cache.setServerStatus(ServerStatus.ERROR);
            throw error;
        }
    }

    // Método para verificar actualizaciones de destacados en segundo plano
    private static async checkForFeaturedUpdatesInBackground(cacheKey: string) {
        try {
            const response = await axios.get(`${BASE_URL_PRODUCT}/featured`);

            // Verificar si los datos han cambiado
            if (cache.hasChanged(cacheKey, response.data)) {
                // Actualizar caché con nuevos datos
                cache.set(cacheKey, response.data);

                // Disparar evento personalizado para notificar cambios
                window.dispatchEvent(new CustomEvent('featuredFocacciaDataUpdated', {
                    detail: { data: response.data, cacheKey }
                }));
            }
        } catch (error) {
            console.warn('Error checking for featured updates in background:', error);
        }
    }

    // Método para forzar actualización del caché
    static async forceRefresh() {
        clearProductCache();
        const [focaccias, featured] = await Promise.all([
            this.getFocaccias(),
            this.getFeaturedFocaccias()
        ]);
        return { focaccias, featured };
    }

    // Método para obtener información del caché (útil para debugging)
    static getCacheInfo() {
        return cache.getCacheInfo();
    }

    // Método para obtener el estado del servidor
    static getServerStatus(): ServerStatus {
        return cache.getServerStatus();
    }

    // Método para limpiar caché de fallback
    static clearFallbackCache(): void {
        cache.clearFallback();
    }
}