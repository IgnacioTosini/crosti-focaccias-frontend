import React, { useState } from 'react';
import { ImageOptimizer } from '../ImageOptimizer/ImageOptimizer';
import { ImageService } from '../../services/ImageService';
import type { ImageOptimizationOptions } from '../../hooks/useImageOptimizer';
import './_optimizedImageUploader.scss';

interface OptimizedImageUploaderProps {
    onImageUploaded?: (url: string, publicId: string) => void;
    onUploadError?: (error: string) => void;
    optimizationOptions?: ImageOptimizationOptions;
    className?: string;
}

export const OptimizedImageUploader: React.FC<OptimizedImageUploaderProps> = ({
    onImageUploaded,
    onUploadError,
    optimizationOptions,
    className = ''
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [uploadStats, setUploadStats] = useState<{
        originalSize: number;
        optimizedSize: number;
        compressionRatio: number;
    } | null>(null);

    const handleImageOptimized = async (
        optimizedFile: File,
        stats: { originalSize: number; optimizedSize: number; compressionRatio: number }
    ) => {
        setIsUploading(true);
        setUploadStats(stats);

        try {
            console.log('🚀 Subiendo imagen optimizada a Cloudinary...');

            const response = await ImageService.uploadImage(optimizedFile, {
                enableOptimization: false, // Ya está optimizada
                ...optimizationOptions
            });

            if (response.success) {
                setUploadedUrl(response.url);
                onImageUploaded?.(response.url, response.public_id);
                console.log('✅ Imagen subida exitosamente:', response.url);
            } else {
                throw new Error(response.error || 'Error al subir imagen');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error al subir imagen:', errorMessage);
            onUploadError?.(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`optimizedImageUploader ${className}`}>
            <ImageOptimizer
                onImageOptimized={handleImageOptimized}
                options={{
                    maxWidth: 1200,
                    maxHeight: 800,
                    quality: 0.85,
                    format: 'jpeg',
                    maxSizeKB: 400,
                    ...optimizationOptions
                }}
                showPreview={true}
            />

            {isUploading && (
                <div className="uploadingIndicator">
                    <div className="spinner"></div>
                    <span>Subiendo imagen optimizada a Cloudinary...</span>
                </div>
            )}

            {uploadedUrl && (
                <div className="uploadSuccess">
                    <div className="successMessage">
                        <span className="successIcon">✅</span>
                        <span>¡Imagen subida exitosamente!</span>
                    </div>

                    {uploadStats && (
                        <div className="uploadSummary">
                            <h4>📈 Resumen de la optimización:</h4>
                            <ul>
                                <li>Tamaño original: <strong>{formatFileSize(uploadStats.originalSize)}</strong></li>
                                <li>Tamaño final: <strong>{formatFileSize(uploadStats.optimizedSize)}</strong></li>
                                <li>Reducción: <strong className="success">{uploadStats.compressionRatio}%</strong></li>
                                <li>Ahorro de ancho de banda: <strong className="success">
                                    {formatFileSize(uploadStats.originalSize - uploadStats.optimizedSize)}
                                </strong></li>
                            </ul>
                        </div>
                    )}

                    <div className="imagePreview">
                        <img src={uploadedUrl} alt="Imagen subida" />
                    </div>
                </div>
            )}
        </div>
    );
};