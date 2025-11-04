import { useState, useCallback } from 'react';

export interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
    maxSizeKB?: number;
}

export interface OptimizedImageResult {
    file: File;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    preview: string;
}

export const useImageOptimizer = () => {
    const [isOptimizing, setIsOptimizing] = useState(false);

    const optimizeImage = useCallback(async (
        file: File,
        options: ImageOptimizationOptions = {}
    ): Promise<OptimizedImageResult> => {
        // Validar que el archivo no esté vacío
        if (!file || file.size === 0 || !file.name) {
            throw new Error('Archivo inválido o vacío');
        }

        setIsOptimizing(true);

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
                    // Calcular nuevas dimensiones manteniendo la proporción
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Dibujar la imagen redimensionada
                    ctx!.drawImage(img, 0, 0, width, height);

                    // Función para convertir a blob con calidad ajustable
                    const convertToBlob = (currentQuality: number): Promise<Blob> => {
                        return new Promise((resolveBlob) => {
                            canvas.toBlob((blob) => {
                                if (blob) {
                                    resolveBlob(blob);
                                }
                            }, `image/${format}`, currentQuality);
                        });
                    };

                    // Optimizar calidad hasta alcanzar el tamaño deseado
                    const optimizeQuality = async (initialQuality: number): Promise<Blob> => {
                        let currentQuality = initialQuality;
                        let blob = await convertToBlob(currentQuality);
                        let bestBlob = blob;

                        // Si la imagen optimizada es más grande que la original, usar la original
                        if (blob.size >= file.size) {
                            return new Blob([file], { type: file.type });
                        }

                        // Si la imagen es más grande que el tamaño máximo, reducir calidad
                        while (blob.size > maxSizeKB * 1024 && currentQuality > 0.1) {
                            currentQuality -= 0.1;
                            blob = await convertToBlob(currentQuality);

                            // Si se vuelve más grande que la original, parar y usar la mejor versión
                            if (blob.size >= file.size) {
                                break;
                            }
                            bestBlob = blob;
                        }

                        return bestBlob;
                    };

                    optimizeQuality(quality).then((optimizedBlob) => {
                        // Crear el archivo optimizado
                        const optimizedFile = new File(
                            [optimizedBlob],
                            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
                            {
                                type: `image/${format}`,
                                lastModified: Date.now(),
                            }
                        );

                        // Crear preview URL
                        const preview = URL.createObjectURL(optimizedBlob);

                        // Verificar si realmente se optimizó o si es mejor usar el original
                        let finalFile = optimizedFile;
                        let finalSize = optimizedBlob.size;
                        let finalPreview = preview;

                        // Si la imagen optimizada es más grande que la original, usar la original
                        if (optimizedBlob.size >= file.size) {
                            finalFile = file;
                            finalSize = file.size;
                            URL.revokeObjectURL(preview);
                            finalPreview = URL.createObjectURL(file);
                        }

                        // Asegurar que el ratio de compresión sea correcto
                        const compressionRatio = file.size > finalSize
                            ? Math.round(((file.size - finalSize) / file.size) * 100)
                            : 0;

                        const result: OptimizedImageResult = {
                            file: finalFile,
                            originalSize: file.size,
                            optimizedSize: finalSize,
                            compressionRatio,
                            preview: finalPreview
                        };

                        setIsOptimizing(false);
                        resolve(result);
                    }).catch(reject);

                } catch (error) {
                    setIsOptimizing(false);
                    reject(error);
                }
            };

            img.onerror = () => {
                setIsOptimizing(false);
                reject(new Error('Error al cargar la imagen'));
            };

            img.src = URL.createObjectURL(file);
        });
    }, []);

    const optimizeMultipleImages = useCallback(async (
        files: FileList | File[],
        options?: ImageOptimizationOptions
    ): Promise<OptimizedImageResult[]> => {
        setIsOptimizing(true);

        const fileArray = Array.from(files);
        const results: OptimizedImageResult[] = [];

        try {
            for (const file of fileArray) {
                if (file.type.startsWith('image/')) {
                    const result = await optimizeImage(file, options);
                    results.push(result);
                }
            }
            return results;
        } finally {
            setIsOptimizing(false);
        }
    }, [optimizeImage]);

    // Función para limpiar URLs de preview
    const cleanupPreviews = useCallback((results: OptimizedImageResult[]) => {
        results.forEach(result => {
            if (result.preview) {
                URL.revokeObjectURL(result.preview);
            }
        });
    }, []);

    // Función para obtener información de una imagen sin optimizarla
    const getImageInfo = useCallback((file: File): Promise<{ width: number; height: number; size: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    size: file.size
                });
            };
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = URL.createObjectURL(file);
        });
    }, []);

    return {
        optimizeImage,
        optimizeMultipleImages,
        cleanupPreviews,
        getImageInfo,
        isOptimizing
    };
};