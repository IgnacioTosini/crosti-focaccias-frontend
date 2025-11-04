import axios from "axios";
import type { FocacciaItem, FocacciaCreate } from "../types";

const BASE_URL_PRODUCT = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/focaccias';

// Cache simple para almacenar respuestas
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Utilidad para obtener apiKey de la URL
export function getApiKeyFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('apiKey');
}

// Utilidad para verificar si un item del cache está vigente
function isCacheValid(cacheItem: { data: unknown; timestamp: number }): boolean {
    return Date.now() - cacheItem.timestamp < CACHE_DURATION;
}

// Función para limpiar el caché cuando se modifiquen los datos
function clearCache(): void {
    cache.clear();
}

export class ProductService {

    static async createFocaccia(focacciaData: FocacciaCreate) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}?apiKey=${encodeURIComponent(apiKey)}` : BASE_URL_PRODUCT;
        const response = await axios.post(url, focacciaData);

        // Limpiar caché después de crear
        clearCache();

        return response.data;
    }

    static async getFocaccias() {
        const cacheKey = 'focaccias';
        const cachedData = cache.get(cacheKey);

        // Verificar si tenemos datos en caché y están vigentes
        if (cachedData && isCacheValid(cachedData)) {
            return cachedData.data;
        }

        const response = await axios.get(BASE_URL_PRODUCT);

        // Guardar en caché la respuesta
        cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
        });

        return response.data;
    }

    static async getFocacciaById(id: number) {
        const response = await axios.get(`${BASE_URL_PRODUCT}/${id}`);
        return response.data;
    }

    static async updateFocaccia(id: number, focacciaData: FocacciaItem) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL_PRODUCT}/${id}`;
        const response = await axios.put(url, focacciaData);

        // Limpiar caché después de actualizar
        clearCache();

        return response.data;
    }

    static async deleteFocaccia(id: number) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL_PRODUCT}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL_PRODUCT}/${id}`;
        const response = await axios.delete(url);

        // Limpiar caché después de eliminar
        clearCache();

        return response.data;
    }

    static async getFeaturedFocaccias() {
        const cacheKey = 'featuredFocaccias';
        const cachedData = cache.get(cacheKey);

        // Verificar si tenemos datos en caché y están vigentes
        if (cachedData && isCacheValid(cachedData)) {
            return cachedData.data;
        }

        const response = await axios.get(`${BASE_URL_PRODUCT}/featured`);

        // Guardar en caché la respuesta
        cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
        });

        return response.data;
    }
}