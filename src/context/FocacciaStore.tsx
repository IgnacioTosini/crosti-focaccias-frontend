import { useState, useCallback } from "react";
import type { FocacciaCreate, FocacciaItem } from "../types";
import { FocacciaContext } from "./focacciaContext";
import { ProductService } from "../services/ProductService";
import { toast } from "react-toastify";

export type FocacciaStoreProps = {
    focaccias: FocacciaItem[];
    focaccia: FocacciaItem | null;
    isLoading: boolean;
    message: string;
    focacciaEdit: FocacciaItem | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setFocacciaEdit: (focaccia: FocacciaItem | null) => void;
    createFocaccia: (focacciaData: FocacciaCreate) => Promise<void>;
    getFocaccias: () => Promise<void>;
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
    const [message, setMessage] = useState<string>("");
    const [lastToastMessage, setLastToastMessage] = useState<string>("");
    const [lastToastTime, setLastToastTime] = useState<number>(0);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

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
            setMessage(response.message);
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
        // Si ya tenemos datos y no se fuerza la recarga, no hacer nada
        if (isDataLoaded && focaccias.length > 0 && !force) {
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await ProductService.getFocaccias();
            setFocaccias(response.data);
            setMessage(response.message);
            setIsDataLoaded(true);
        } catch (error) {
            setMessage(`Error al obtener las focaccias: ${error}`);
            showToast("Error al obtener las focaccias", "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast, isDataLoaded, focaccias.length]);

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
            setMessage(response.message);
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
            setMessage(response.message);
            await getFocaccias(true); // Forzar recarga después de eliminar
            showToast("Focaccia eliminada exitosamente", "success");
        } catch (error) {
            setMessage(`Error al eliminar la focaccia: ${error}`);
            showToast("Error al eliminar la focaccia", "error");
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <FocacciaContext.Provider value={{ focaccias, focaccia, isLoading, message, focacciaEdit, isOpen, setIsOpen, createFocaccia, getFocaccias, getFocacciaById, updateFocaccia, deleteFocaccia, getFeaturedFocaccias, setFocacciaEdit }}>
            {children}
        </FocacciaContext.Provider>
    );
};