import axios from "axios";
import { getApiKeyFromUrl } from "./ProductService";
import { env } from '../config/env';

const CLOUDINARY_UPLOAD_URL = env.VITE_BASE_URL?.replace('/focaccias', '/cloudinary/upload') || "http://localhost:8080/api/cloudinary/upload";

export type CloudinaryUploadResponse = {
    success: boolean;
    url: string;
    public_id: string;
    error?: string;
    originalSize?: number;
    optimizedSize?: number;
    compressionRatio?: number;
};

export interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
    maxSizeKB?: number;
    enableOptimization?: boolean;
}

export class ImageService {
    /**
     * Optimiza una imagen antes de subirla
     */
    static async optimizeImage(
        file: File, 
        options: ImageOptimizationOptions = {}
    ): Promise<{ file: File; stats: { originalSize: number; optimizedSize: number; compressionRatio: number } }> {
        const {
            maxWidth = 1200,
            maxHeight = 800,
            quality = 0.8,
            format = 'jpeg',
            maxSizeKB = 500
        } = options;

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    // Calcular nuevas dimensiones
                    let { width, height } = img;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx!.drawImage(img, 0, 0, width, height);

                    // Función para ajustar calidad automáticamente
                    const optimizeQuality = async (initialQuality: number): Promise<Blob> => {
                        let currentQuality = initialQuality;
                        let blob: Blob;
                        
                        do {
                            blob = await new Promise<Blob>((resolveBlob) => {
                                canvas.toBlob((b) => resolveBlob(b!), `image/${format}`, currentQuality);
                            });
                            
                            if (blob.size <= maxSizeKB * 1024 || currentQuality <= 0.1) break;
                            currentQuality -= 0.1;
                        } while (currentQuality > 0.1);
                        
                        return blob;
                    };

                    optimizeQuality(quality).then((optimizedBlob) => {
                        const optimizedFile = new File(
                            [optimizedBlob],
                            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
                            { type: `image/${format}`, lastModified: Date.now() }
                        );

                        const stats = {
                            originalSize: file.size,
                            optimizedSize: optimizedBlob.size,
                            compressionRatio: Math.round(((file.size - optimizedBlob.size) / file.size) * 100)
                        };

                        resolve({ file: optimizedFile, stats });
                    }).catch(reject);

                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = URL.createObjectURL(file);
        });
    }

    static async uploadImage(
        file: File, 
        options: ImageOptimizationOptions = { enableOptimization: true }
    ): Promise<CloudinaryUploadResponse> {
        let fileToUpload = file;
        let stats = { originalSize: file.size, optimizedSize: file.size, compressionRatio: 0 };

        // Optimizar imagen si está habilitado y es una imagen
        if (options.enableOptimization && file.type.startsWith('image/')) {
            try {
                console.log(`🔄 Optimizando imagen: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                const optimized = await this.optimizeImage(file, options);
                fileToUpload = optimized.file;
                stats = optimized.stats;
                console.log(`✅ Imagen optimizada: ${(stats.compressionRatio)}% de reducción (${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB)`);
            } catch (error) {
                console.warn('⚠️ Error al optimizar imagen, subiendo original:', error);
                // Si falla la optimización, subir el archivo original
            }
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        
        const apiKey = getApiKeyFromUrl();
        const url = apiKey ? `${CLOUDINARY_UPLOAD_URL}?apiKey=${encodeURIComponent(apiKey)}` : CLOUDINARY_UPLOAD_URL;
        
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            ...response.data,
            originalSize: stats.originalSize,
            optimizedSize: stats.optimizedSize,
            compressionRatio: stats.compressionRatio
        };
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
