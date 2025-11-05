import { useState, useEffect } from 'react';
import { ProductService } from '../services/ProductService';

interface CacheInfo {
    keys: string[];
    memorySize: number;
    storageSize: number;
}

/**
 * Hook personalizado para gestionar el caché de productos
 * Proporciona información y control sobre el sistema de caché
 */
export const useProductCache = () => {
    const [cacheInfo, setCacheInfo] = useState<CacheInfo>({ keys: [], memorySize: 0, storageSize: 0 });
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Obtener información del caché
    const getCacheInfo = () => {
        const info = ProductService.getCacheInfo();
        setCacheInfo(info);
        return info;
    };

    // Forzar actualización del caché
    const forceRefresh = async () => {
        setIsRefreshing(true);
        try {
            await ProductService.forceRefresh();
            getCacheInfo();
        } catch (error) {
            console.error('Error al forzar actualización del caché:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Actualizar información del caché al montar
    useEffect(() => {
        getCacheInfo();
    }, []);

    return {
        cacheInfo,
        isRefreshing,
        getCacheInfo,
        forceRefresh
    };
};