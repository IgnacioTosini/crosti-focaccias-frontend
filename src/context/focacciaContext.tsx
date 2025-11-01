import { createContext, useContext } from "react";
import type { FocacciaStoreProps } from "./FocacciaStore";

export const FocacciaContext = createContext<FocacciaStoreProps | undefined>(undefined);

export const useFocacciaContext = () => {
    const context = useContext(FocacciaContext);
    if (!context) {
        throw new Error("useFocacciaContext must be used within a FocacciaProvider");
    }
    return context;
};