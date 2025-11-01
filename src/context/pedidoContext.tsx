import { createContext, useContext } from "react";
import type { PedidoStoreProps } from "./PedidoStore";

export const PedidoContext = createContext<PedidoStoreProps | undefined>(undefined);

export const usePedidoContext = () => {
    const context = useContext(PedidoContext);
    if (!context) {
        throw new Error("usePedidoContext must be used within a PedidoProvider");
    }
    return context;
};