import axios from "axios";
import type { FocacciaItem, FocacciaCreate } from "../types";

const BASE_URL_PRODUCT = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/focaccias';

// Configuración del caché
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos
const CACHE_PREFIX = 'crosti_focaccias_';

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
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }
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

    // Obtener información del caché para debugging
    getCacheInfo(): { keys: string[]; memorySize: number; storageSize: number } {
        const keys = Array.from(this.memoryCache.keys());
        const storageKeys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
        
        return {
            keys,
            memorySize: this.memoryCache.size,
            storageSize: storageKeys.length
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
            return cachedData;
        }

        // Si no hay caché, hacer petición normal
        const response = await axios.get(BASE_URL_PRODUCT);

        // Guardar en caché la respuesta
        cache.set(cacheKey, response.data);

        return response.data;
    }

    // Nuevo método para carga por lotes - obtener solo los primeros productos
    static async getFocacciasBatch(limit?: number) {
        const cacheKey = limit ? `focaccias_batch_${limit}` : 'focaccias_batch';
        
        // Intentar obtener del caché primero
        const cachedData = cache.get<{ data: FocacciaItem[]; message: string; success: boolean }>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // Construir URL con limit si se proporciona
        const url = limit ? `${BASE_URL_PRODUCT}?limit=${limit}` : BASE_URL_PRODUCT;
        const response = await axios.get(url);

        // Si es un lote limitado, no guardar en caché principal
        if (limit) {
            cache.set(cacheKey, response.data);
        } else {
            // Si es carga completa, guardar en caché principal también
            cache.set('focaccias', response.data);
            cache.set(cacheKey, response.data);
        }

        return response.data;
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
            return cachedData;
        }

        // Si no hay caché, hacer petición normal
        const response = await axios.get(`${BASE_URL_PRODUCT}/featured`);

        // Guardar en caché la respuesta
        cache.set(cacheKey, response.data);

        return response.data;
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
}