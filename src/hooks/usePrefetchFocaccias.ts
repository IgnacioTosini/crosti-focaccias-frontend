import { useEffect, useRef } from 'react';
import { useFocacciaContext } from '../context/focacciaContext';

/**
 * Hook personalizado para precargar datos de focaccias
 * Se ejecuta una sola vez al montar el componente
 */
export const usePrefetchFocaccias = () => {
    const { getFocaccias } = useFocacciaContext();
    const hasFetched = useRef(false);

    useEffect(() => {
        // Solo ejecutar la primera vez que se monta
        if (!hasFetched.current) {
            hasFetched.current = true;
            getFocaccias();
        }
    }, [getFocaccias]);
};