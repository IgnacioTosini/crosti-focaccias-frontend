import { useCallback, useRef } from 'react';
import { useFocacciaContext } from '../context/focacciaContext';

/**
 * Hook para precargar focaccias cuando se hace hover sobre elementos de navegación
 * Implementa debounce para evitar múltiples llamadas
 */
export const usePrefetchOnHover = () => {
    const { getFocacciasBatch, focaccias } = useFocacciaContext();
    const prefetchTimeoutRef = useRef<number | null>(null);
    const hasPrefetched = useRef(false);

    const handleMouseEnter = useCallback(() => {
        // Si ya tenemos datos o ya hicimos prefetch, no hacer nada
        if (hasPrefetched.current || focaccias.length > 0) {
            return;
        }

        // Debounce: solo precargar si el hover dura más de 300ms
        prefetchTimeoutRef.current = setTimeout(() => {
            hasPrefetched.current = true;
            getFocacciasBatch(4); // Precargar solo los primeros 4
        }, 300);
    }, [getFocacciasBatch, focaccias.length]);

    const handleMouseLeave = useCallback(() => {
        // Cancelar precarga si se quita el hover antes del timeout
        if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
            prefetchTimeoutRef.current = null;
        }
    }, []);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
        }
    }, []);

    return {
        handleMouseEnter,
        handleMouseLeave,
        cleanup,
        hasPrefetched: hasPrefetched.current
    };
};