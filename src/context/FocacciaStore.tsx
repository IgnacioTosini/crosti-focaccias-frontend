import { useState, useCallback, useEffect } from "react";
import type { FocacciaCreate, FocacciaItem } from "../types";
import { FocacciaContext } from "./focacciaContext";
import { ProductService } from "../services/ProductService";
import { toast } from "react-toastify";

export type FocacciaStoreProps = {
    focaccias: FocacciaItem[];
    focaccia: FocacciaItem | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    message: string;
    focacciaEdit: FocacciaItem | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setFocacciaEdit: (focaccia: FocacciaItem | null) => void;
    createFocaccia: (focacciaData: FocacciaCreate) => Promise<void>;
    getFocaccias: () => Promise<void>;
    getFocacciasBatch: (limit?: number) => Promise<void>;
    loadMoreFocaccias: () => Promise<void>;
    getFocacciaById: (id: number) => Promise<void>;
    updateFocaccia: (id: number, focacciaData: FocacciaItem) => Promise<void>;
    deleteFocaccia: (id: number) => Promise<void>;
    getFeaturedFocaccias: () => Promise<void>;
};

export const FocacciaStore: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [focaccias, setFocaccias] = useState<FocacciaItem[]>([]);
    const [focaccia, setFocaccia] = useState<FocacciaItem | null>(null);
    const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [lastToastMessage, setLastToastMessage] = useState<string>("");
    const [lastToastTime, setLastToastTime] = useState<number>(0);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [hasMoreData, setHasMoreData] = useState<boolean>(true);
    const [initialBatchSize] = useState<number>(4);

    const showToast = useCallback((message: string, type: 'success' | 'error', cooldown: number = 3000) => {
        const now = Date.now();
        const isSameMessage = lastToastMessage === message;
        const isWithinCooldown = now - lastToastTime < cooldown;

        if (!isSameMessage || !isWithinCooldown) {
            if (type === 'success') {
                toast.success(message);
            } else {
                toast.error(message);
            }
            setLastToastMessage(message);
            setLastToastTime(now);
        }
    }, [lastToastMessage, lastToastTime]);

    const createFocaccia = async (focacciaData: FocacciaCreate) => {
        setIsLoading(true);
        try {
            const response = await ProductService.createFocaccia(focacciaData);
            setMessage(response.message || "");
            // El ProductService ya limpia el caché, solo necesitamos recargar
            await getFocaccias(true); // Forzar recarga después de crear
            showToast("Focaccia creada exitosamente", "success");
        } catch (error) {
            setMessage(`Error al crear la focaccia: ${error}`);
            showToast("Error al crear la focaccia", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const getFocaccias = useCallback(async (force: boolean = false) => {
        try {
            // Si se fuerza la recarga o no tenemos datos cargados, mostrar loading
            if (force || !isDataLoaded) {
                setIsLoading(true);
            }

            const response = await ProductService.getFocaccias();
            
            // Actualizar los datos independientemente de si vienen del caché o no
            setFocaccias(response.data || []);
            setMessage(response.message || "");
            
            // Marcar como cargado si no estaba antes
            if (!isDataLoaded) {
                setIsDataLoaded(true);
            }
        } catch (error) {
            setMessage(`Error al obtener las focaccias: ${error}`);
            showToast("Error al obtener las focaccias", "error");
            setFocaccias([]); // Limpiar datos en caso de error
        } finally {
            setIsLoading(false);
        }
    }, [showToast, isDataLoaded]);

    const getFocacciaById = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await ProductService.getFocacciaById(id);
            setFocaccia(response.data);
            setMessage(response.message);
        } catch (error) {
            setMessage(`Error al obtener la focaccia: ${error}`);
            showToast("Error al obtener la focaccia", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const updateFocaccia = async (id: number, focacciaData: FocacciaItem) => {
        setIsLoading(true);
        try {
            const response = await ProductService.updateFocaccia(id, focacciaData);
            setMessage(response.message || "");
            // El ProductService ya limpia el caché, solo necesitamos recargar
            await getFocaccias(true); // Forzar recarga después de actualizar
            showToast("Focaccia actualizada exitosamente", "success");
        } catch (error) {
            setMessage(`Error al actualizar la focaccia: ${error}`);
            showToast("Error al actualizar la focaccia", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFocaccia = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await ProductService.deleteFocaccia(id);
            setMessage(response.message || "");
            // El ProductService ya limpia el caché, solo necesitamos recargar
            await getFocaccias(true); // Forzar recarga después de eliminar
            showToast("Focaccia eliminada exitosamente", "success");
        } catch (error) {
            setMessage(`Error al eliminar la focaccia: ${error}`);
            showToast("Error al eliminar la focaccia", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const getFocacciasBatch = useCallback(async (limit?: number) => {
        try {
            setIsLoading(true);
            const response = await ProductService.getFocacciasBatch(limit || initialBatchSize);
            
            setFocaccias(response.data || []);
            setMessage(response.message || "");
            setIsDataLoaded(true);
            
            // Si recibimos menos productos de los solicitados, no hay más datos
            if (limit && response.data && response.data.length < limit) {
                setHasMoreData(false);
            }
        } catch (error) {
            setMessage(`Error al obtener las focaccias: ${error}`);
            showToast("Error al obtener las focaccias", "error");
            setFocaccias([]);
        } finally {
            setIsLoading(false);
        }
    }, [showToast, initialBatchSize]);

    const loadMoreFocaccias = useCallback(async () => {
        if (!hasMoreData || isLoadingMore) return;
        
        try {
            setIsLoadingMore(true);
            const response = await ProductService.getFocaccias(); // Cargar todos los restantes
            
            // Solo agregar nuevos productos que no estén ya en la lista
            const currentIds = focaccias.map(f => f.id);
            const newFocaccias = response.data?.filter((f: FocacciaItem) => !currentIds.includes(f.id)) || [];
            
            if (newFocaccias.length > 0) {
                setFocaccias(prev => [...prev, ...newFocaccias]);
            }
            
            setHasMoreData(false); // Ya cargamos todos
            setMessage(response.message || "");
        } catch (error) {
            setMessage(`Error al cargar más focaccias: ${error}`);
            showToast("Error al cargar más focaccias", "error");
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMoreData, isLoadingMore, focaccias, showToast]);

    const getFeaturedFocaccias = async () => {
        setIsLoading(true);
        try {
            const response = await ProductService.getFeaturedFocaccias();
            setFocaccias(response.data);
            setMessage(response.message);
        } catch (error) {
            setMessage(`Error al obtener las focaccias destacadas: ${error}`);
            showToast("Error al obtener las focaccias destacadas", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Effect para escuchar actualizaciones automáticas del caché
    useEffect(() => {
        const handleFocacciaUpdate = (event: CustomEvent) => {
            const { data } = event.detail;
            if (data && data.data) {
                setFocaccias(data.data);
                console.log('Focaccias actualizadas automáticamente desde el caché');
            }
        };

        const handleFeaturedUpdate = (event: CustomEvent) => {
            const { data } = event.detail;
            if (data && data.data) {
                // Si el contexto maneja focaccias destacadas, actualizar aquí
                console.log('Focaccias destacadas actualizadas automáticamente desde el caché');
            }
        };

        // Agregar listeners para actualizaciones automáticas
        window.addEventListener('focacciaDataUpdated', handleFocacciaUpdate as EventListener);
        window.addEventListener('featuredFocacciaDataUpdated', handleFeaturedUpdate as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('focacciaDataUpdated', handleFocacciaUpdate as EventListener);
            window.removeEventListener('featuredFocacciaDataUpdated', handleFeaturedUpdate as EventListener);
        };
    }, []);

    return (
        <FocacciaContext.Provider value={{ 
            focaccias, 
            focaccia, 
            isLoading, 
            isLoadingMore,
            message, 
            focacciaEdit, 
            isOpen, 
            setIsOpen, 
            createFocaccia, 
            getFocaccias, 
            getFocacciasBatch,
            loadMoreFocaccias,
            getFocacciaById, 
            updateFocaccia, 
            deleteFocaccia, 
            getFeaturedFocaccias, 
            setFocacciaEdit 
        }}>
            {children}
        </FocacciaContext.Provider>
    );
};