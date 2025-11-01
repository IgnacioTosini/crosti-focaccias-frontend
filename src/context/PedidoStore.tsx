import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FocacciaItem, Pedido, PedidoRequest, PedidoFocaccia } from "../types";
import { PedidoContext } from "./pedidoContext";
import { PedidoService } from "../services/PedidoService";
import { toast } from "react-toastify";

export type PedidoStoreProps = {
    pedidos: Pedido[];
    pedido: Pedido | null;
    preOrder: {
        pedidoFocaccias: PedidoFocaccia[];
        quantity: number;
        totalPrice: number;
    };
    setPreOrder: Dispatch<SetStateAction<{
        pedidoFocaccias: PedidoFocaccia[];
        quantity: number;
        totalPrice: number;
    }>>;
    isLoading: boolean;
    message: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    createPedido: (pedidoData: PedidoRequest) => Promise<Pedido | undefined>;
    getPedidos: () => Promise<void>;
    getPedidoById: (id: number) => Promise<void>;
    deletePedido: (id: number) => Promise<void>;
    getPedidosByClientPhone: (clientPhone: string) => Promise<void>;
    addToCart: (focaccia: FocacciaItem) => void;
    removeFromCart: (focacciaId: number) => void;
    lessQuantityToItem: (focacciaId: number) => void;
    clearPreOrder: () => void;
};

export const PedidoStore: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [preOrder, setPreOrder] = useState<{
        pedidoFocaccias: PedidoFocaccia[];
        quantity: number;
        totalPrice: number;
    }>({ pedidoFocaccias: [], quantity: 0, totalPrice: 0 });
    const [lastToastMessage, setLastToastMessage] = useState<string>("");
    const [lastToastTime, setLastToastTime] = useState<number>(0);

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

    const createPedido = async (pedidoData: PedidoRequest) => {
        setIsLoading(true);
        try {
            const response = await PedidoService.createPedido(pedidoData);
            setMessage(response.message);
            await getPedidos();
            clearPreOrder(); // limpiar carrito local al crear pedido
            showToast("Pedido creado exitosamente", "success");
            return response.data;
        } catch (error) {
            setMessage(`Error al crear el pedido: ${error}`);
            showToast("Error al crear el pedido", "error");
        } finally {
            setIsLoading(false);
        }
    };
    const getPedidos = async () => {
        setIsLoading(true);
        try {
            const response = await PedidoService.getPedidos();
            setPedidos(response.data);
            setMessage(response.message);
            showToast("Pedidos obtenidos exitosamente", "success");
        } catch (error) {
            setMessage(`Error al obtener los pedidos: ${error}`);
            showToast("Error al obtener los pedidos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const getPedidoById = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await PedidoService.getPedidoById(id);
            setPedido(response.data);
            setMessage(response.message);
            showToast("Pedido obtenido exitosamente", "success");
        } catch (error) {
            setMessage(`Error al obtener el pedido: ${error}`);
            showToast("Error al obtener el pedido", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePedido = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await PedidoService.deletePedido(id);
            setMessage(response.message);
            await getPedidos();
            showToast("Pedido eliminado exitosamente", "success");
        } catch (error) {
            setMessage(`Error al eliminar el pedido: ${error}`);
            showToast("Error al eliminar el pedido", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const getPedidosByClientPhone = async (clientPhone: string) => {
        setIsLoading(true);
        try {
            const response = await PedidoService.getPedidosByClientPhone(clientPhone);
            setPedidos(response.data);
            setMessage(response.message);
            showToast("Pedidos del cliente obtenidos exitosamente", "success");
        } catch (error) {
            setMessage(`Error al obtener los pedidos por teléfono del cliente: ${error}`);
            showToast("Error al obtener los pedidos por teléfono del cliente", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (focaccia: FocacciaItem) => {
        setPreOrder(prev => {
            const existing = prev.pedidoFocaccias.find(item => item.focaccia.id === focaccia.id);
            let newPedidoFocaccias;
            if (existing) {
                newPedidoFocaccias = prev.pedidoFocaccias.map(item =>
                    item.focaccia.id === focaccia.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                newPedidoFocaccias = [...prev.pedidoFocaccias, { focaccia, cantidad: 1 }];
            }
            const quantity = newPedidoFocaccias.reduce((acc, item) => acc + item.cantidad, 0);
            const totalPrice = newPedidoFocaccias.reduce((acc, item) => acc + item.focaccia.price * item.cantidad, 0);
            return { pedidoFocaccias: newPedidoFocaccias, quantity, totalPrice };
        });
    };

    const removeFromCart = (focacciaId: number) => {
        setPreOrder(prev => {
            const existing = prev.pedidoFocaccias.find(item => item.focaccia.id === focacciaId);
            if (!existing) return prev; // no hacer nada si no existe
            const newPedidoFocaccias = prev.pedidoFocaccias.filter(item => item.focaccia.id !== focacciaId);
            const quantity = newPedidoFocaccias.reduce((acc, item) => acc + item.cantidad, 0);
            const totalPrice = newPedidoFocaccias.reduce((acc, item) => acc + item.focaccia.price * item.cantidad, 0);
            return { pedidoFocaccias: newPedidoFocaccias, quantity, totalPrice };
        });
    };

    const lessQuantityToItem = (focacciaId: number) => {
        setPreOrder(prev => {
            const existing = prev.pedidoFocaccias.find(item => item.focaccia.id === focacciaId);
            if (!existing) return prev;
            const newPedidoFocaccias = prev.pedidoFocaccias.map(item =>
                item.focaccia.id === focacciaId
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            ).filter(item => item.cantidad > 0);
            const quantity = newPedidoFocaccias.reduce((acc, item) => acc + item.cantidad, 0);
            const totalPrice = newPedidoFocaccias.reduce((acc, item) => acc + item.focaccia.price * item.cantidad, 0);
            return { pedidoFocaccias: newPedidoFocaccias, quantity, totalPrice };
        });
    };

    const clearPreOrder = () => {
        setPreOrder({ pedidoFocaccias: [], quantity: 0, totalPrice: 0 });
    };

    return (
        <PedidoContext.Provider value={{
            pedidos,
            pedido,
            preOrder,
            setPreOrder,
            isLoading,
            message,
            isOpen,
            setIsOpen,
            createPedido,
            getPedidos,
            getPedidoById,
            deletePedido,
            getPedidosByClientPhone,
            addToCart,
            removeFromCart,
            lessQuantityToItem,
            clearPreOrder
        }}>{children}</PedidoContext.Provider>
    );
};