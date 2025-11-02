import axios from "axios";
import { getApiKeyFromUrl } from "./ProductService";

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL || "http://localhost:8080/api/cloudinary/upload";

export type CloudinaryUploadResponse = {
    success: boolean;
    url: string;
    public_id: string;
    error?: string;
};

export class ImageService {
    static async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
        const formData = new FormData();
        formData.append("file", file);
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${CLOUDINARY_UPLOAD_URL}?apiKey=${encodeURIComponent(apiKey)}` : CLOUDINARY_UPLOAD_URL;
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    static async deleteImage(publicId: string): Promise<{ success: boolean; message?: string; result?: string; error?: string }> {
        const apiKey = getApiKeyFromUrl();
        const url = `${CLOUDINARY_UPLOAD_URL}?publicId=${encodeURIComponent(publicId)}`;
        const response = await axios.delete(url, {
            headers: {
                "X-API-KEY": apiKey || "focacciaCrostiSecret",
            },
        });
        return response.data;
    }
}
