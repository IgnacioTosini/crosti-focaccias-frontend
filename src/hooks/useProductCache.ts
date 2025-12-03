import { useState, useEffect } from 'react';
import { ProductService, ServerStatus } from '../services/ProductService';

interface CacheInfo {
    keys: string[];
    memorySize: number;
    storageSize: number;
    fallbackSize: number;
    serverStatus: ServerStatus;
}

/**
 * Hook personalizado para gestionar el caché de productos
 * Proporciona información y control sobre el sistema de caché
 */
export const useProductCache = () => {
    const [cacheInfo, setCacheInfo] = useState<CacheInfo>({ 
        keys: [], 
        memorySize: 0, 
        storageSize: 0, 
        fallbackSize: 0,
        serverStatus: 'unknown' as ServerStatus
    });
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