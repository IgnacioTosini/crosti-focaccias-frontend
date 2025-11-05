import { useState } from 'react';
import { useProductCache } from '../../hooks/useProductCache';
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
                            <span className="label">Memoria:</span>
                            <span className="value">{cacheInfo.memorySize} items</span>
                        </div>
                        <div className="stat">
                            <span className="label">Storage:</span>
                            <span className="value">{cacheInfo.storageSize} items</span>
                        </div>
                    </div>
                    
                    <div className="cache-keys">
                        <strong>Claves en caché:</strong>
                        <ul>
                            {cacheInfo.keys.map((key) => (
                                <li key={key}>{key}</li>
                            ))}
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
                    </div>
                </div>
            )}
        </div>
    );
};