import { useState, useEffect } from 'react';
import { useServerStatus } from '../../hooks/useServerStatus';
import { ServerStatus } from '../../services/ProductService';
import './_serverStatusIndicator.scss';

/**
 * Componente que muestra el estado actual del servidor
 * Se oculta automáticamente después de 5 segundos
 */
export const ServerStatusIndicator = () => {
    const { serverStatus, isUsingCache } = useServerStatus();
    const [isVisible, setIsVisible] = useState(false);
    const [hideTimeout, setHideTimeout] = useState<number | null>(null);

    // Mostrar el indicador y ocultarlo después de 5 segundos
    useEffect(() => {
        // Mostrar si el servidor no está activo o si se usa caché
        const shouldShow = serverStatus !== ServerStatus.ACTIVE || isUsingCache;
        
        if (shouldShow) {
            setIsVisible(true);
            
            // Limpiar timeout anterior si existe
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            
            // Ocultar después de 5 segundos
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            
            setHideTimeout(timeout);
        } else {
            setIsVisible(false);
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        }

        // Cleanup
        return () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        };
    }, [serverStatus, isUsingCache]);

    // No mostrar nada si no debe ser visible
    if (!isVisible) {
        return null;
    }

    const getStatusConfig = () => {
        switch (serverStatus) {
            case ServerStatus.HIBERNATING:
                return {
                    className: 'server-status--hibernating',
                    icon: '🔄',
                    text: 'Servidor iniciándose...',
                    subText: 'Mostrando datos guardados'
                };
            case ServerStatus.ERROR:
                return {
                    className: 'server-status--error',
                    icon: '⚠️',
                    text: 'Sin conexión',
                    subText: 'Mostrando datos guardados'
                };
            case ServerStatus.UNKNOWN:
                return {
                    className: 'server-status--unknown',
                    icon: '🔍',
                    text: 'Verificando servidor...',
                    subText: ''
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    return (
        <div className={`server-status ${config.className}`}>
            <div className="server-status__content">
                <span className="server-status__icon">{config.icon}</span>
                <div className="server-status__text">
                    <span className="server-status__main">{config.text}</span>
                    {config.subText && (
                        <span className="server-status__sub">{config.subText}</span>
                    )}
                </div>
            </div>
        </div>
    );
};
