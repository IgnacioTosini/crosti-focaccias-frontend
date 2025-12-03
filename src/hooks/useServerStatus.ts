import { useState, useEffect } from 'react';
import { ProductService, ServerStatus } from '../services/ProductService';

/**
 * Hook para monitorear el estado del servidor y registrar eventos en consola
 */
export const useServerStatus = () => {
    const [serverStatus, setServerStatus] = useState<ServerStatus>(ServerStatus.UNKNOWN);
    const [isUsingCache, setIsUsingCache] = useState(false);

    useEffect(() => {
        // Listener para cambios en el estado del servidor
        const handleServerStatusChange = (event: CustomEvent) => {
            const { status } = event.detail;
            setServerStatus(status);

            // Registrar en consola según el estado
            if (status === ServerStatus.HIBERNATING) {
                console.info('🔄 [SERVER] Servidor iniciándose... Mostrando datos guardados');
            } else if (status === ServerStatus.ACTIVE) {
                // Solo mostrar si anteriormente estaba hibernando
                if (serverStatus === ServerStatus.HIBERNATING) {
                    console.info('✅ [SERVER] Servidor activo - Datos actualizados');
                }
                setIsUsingCache(false);
            } else if (status === ServerStatus.ERROR) {
                console.error('❌ [SERVER] Error de conexión con el servidor');
            }
        };

        // Listener para cuando se usan datos cacheados
        const handleUsingCachedData = (event: CustomEvent) => {
            const { message, cacheKey, error } = event.detail;
            setIsUsingCache(true);
            
            console.warn('⚠️ [CACHE] ' + message, {
                cacheKey,
                error: error || 'N/A'
            });
        };

        // Listener para cuando los datos se actualizan desde el servidor
        const handleDataUpdated = (event: CustomEvent) => {
            if (isUsingCache) {
                console.info('🔄 [CACHE] Datos actualizados desde el servidor', {
                    cacheKey: event.detail?.cacheKey
                });
                setIsUsingCache(false);
            }
        };

        // Agregar listeners
        window.addEventListener('serverStatusChanged', handleServerStatusChange as EventListener);
        window.addEventListener('usingCachedData', handleUsingCachedData as EventListener);
        window.addEventListener('focacciaDataUpdated', handleDataUpdated as EventListener);
        window.addEventListener('featuredFocacciaDataUpdated', handleDataUpdated as EventListener);

        // Obtener estado inicial
        const initialStatus = ProductService.getServerStatus();
        setServerStatus(initialStatus);

        // Cleanup
        return () => {
            window.removeEventListener('serverStatusChanged', handleServerStatusChange as EventListener);
            window.removeEventListener('usingCachedData', handleUsingCachedData as EventListener);
            window.removeEventListener('focacciaDataUpdated', handleDataUpdated as EventListener);
            window.removeEventListener('featuredFocacciaDataUpdated', handleDataUpdated as EventListener);
        };
    }, [serverStatus, isUsingCache]);

    return {
        serverStatus,
        isUsingCache,
        isServerActive: serverStatus === ServerStatus.ACTIVE,
        isServerHibernating: serverStatus === ServerStatus.HIBERNATING,
        hasServerError: serverStatus === ServerStatus.ERROR
    };
};
