import { useEffect, useRef } from 'react';
import { useFocacciaContext } from '../context/focacciaContext';

/**
 * Hook personalizado para precargar datos de focaccias
 * Se ejecuta una sola vez al montar el componente
 * Usa carga por lotes para mejor rendimiento inicial
 */
export const usePrefetchFocaccias = () => {
    const { getFocacciasBatch, focaccias } = useFocacciaContext();
    const hasFetched = useRef(false);

    useEffect(() => {
        // Solo ejecutar la primera vez que se monta y si no hay datos
        if (!hasFetched.current && focaccias.length === 0) {
            hasFetched.current = true;
            // Cargar solo los primeros 4 productos para carga rápida
            getFocacciasBatch(4);
        }
    }, [getFocacciasBatch, focaccias.length]);
};