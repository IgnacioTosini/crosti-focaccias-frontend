import { useState } from 'react';
import { useProductCache } from '../../hooks/useProductCache';
import { ProductService } from '../../services/ProductService';
import './CacheDebugger.scss';

interface CacheDebuggerProps {
    show?: boolean;
}

export const CacheDebugger: React.FC<CacheDebuggerProps> = ({ show = false }) => {
    const { cacheInfo, isRefreshing, getCacheInfo, forceRefresh } = useProductCache();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!show && import.meta.env.PROD) {
        return null;
    }

    const handleRefresh = () => {
        getCacheInfo();
    };

    const handleClearFallback = () => {
        if (window.confirm('¿Estás seguro de que quieres limpiar el caché de fallback?')) {
            ProductService.clearFallbackCache();
            getCacheInfo();
        }
    };

    const getServerStatusDisplay = () => {
        const statusEmoji: Record<string, string> = {
            active: '✅',
            hibernating: '🔄',
            error: '❌',
            unknown: '🔍'
        };
        return `${statusEmoji[cacheInfo.serverStatus] || '❓'} ${cacheInfo.serverStatus}`;
    };

    return (
        <div className={`cache-debugger ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button 
                className="cache-debugger-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                🔧 Caché Info {isExpanded ? '▼' : '▶'}
            </button>
            
            {isExpanded && (
                <div className="cache-debugger-content">
                    <div className="cache-stats">
                        <div className="stat">
                            <span className="label">Estado Servidor:</span>
                            <span className="value">{getServerStatusDisplay()}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Memoria:</span>
                            <span className="value">{cacheInfo.memorySize} items</span>
                        </div>
                        <div className="stat">
                            <span className="label">Storage:</span>
                            <span className="value">{cacheInfo.storageSize} items</span>
                        </div>
                        <div className="stat">
                            <span className="label">Fallback:</span>
                            <span className="value">{cacheInfo.fallbackSize} items</span>
                        </div>
                    </div>
                    
                    <div className="cache-keys">
                        <strong>Claves en caché:</strong>
                        <ul>
                            {cacheInfo.keys.length > 0 ? (
                                cacheInfo.keys.map((key) => (
                                    <li key={key}>{key}</li>
                                ))
                            ) : (
                                <li style={{ color: '#999' }}>Sin datos en caché</li>
                            )}
                        </ul>
                    </div>
                    
                    <div className="cache-actions">
                        <button onClick={handleRefresh} disabled={isRefreshing}>
                            Actualizar Info
                        </button>
                        <button 
                            onClick={forceRefresh} 
                            disabled={isRefreshing}
                            className="force-refresh"
                        >
                            {isRefreshing ? 'Refrescando...' : 'Forzar Refresh'}
                        </button>
                        <button 
                            onClick={handleClearFallback}
                            className="clear-fallback"
                        >
                            Limpiar Fallback
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};