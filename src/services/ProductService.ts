import axios from "axios";
import type { FocacciaItem, FocacciaCreate } from "../types";

const BASE_URL = 'http://localhost:8080/api/focaccias';

// Utilidad para obtener apiKey de la URL
export function getApiKeyFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('apiKey');
}

export class ProductService {

    static async createFocaccia(focacciaData: FocacciaCreate) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL}?apiKey=${encodeURIComponent(apiKey)}` : BASE_URL;
        const response = await axios.post(url, focacciaData);
        return response.data;
    }

    static async getFocaccias() {
        const response = await axios.get(BASE_URL);
        return response.data;
    }

    static async getFocacciaById(id: number) {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    static async updateFocaccia(id: number, focacciaData: FocacciaItem) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL}/${id}`;
        const response = await axios.put(url, focacciaData);
        return response.data;
    }

    static async deleteFocaccia(id: number) {
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${BASE_URL}/${id}?apiKey=${encodeURIComponent(apiKey)}` : `${BASE_URL}/${id}`;
        const response = await axios.delete(url);
        return response.data;
    }

    static async getFeaturedFocaccias() {
        const response = await axios.get(`${BASE_URL}/featured`);
        return response.data;
    }
}