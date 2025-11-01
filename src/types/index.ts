export type FocacciaCreate = Omit<FocacciaItem, "id" | "pedidos">;

export type FocacciaItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    isVeggie: boolean;
    imageUrl: string;
    imagePublicId: string;
    featured: boolean;
    pedidos: Pedido[];
};

export type PedidoRequest = {
    clientPhone: string;
    focaccias: { focacciaId: number; cantidad: number }[];
};

export type PedidoFocaccia = {
    focaccia: FocacciaItem;
    cantidad: number;
};

export type PedidoFocacciaResponse = {
    focacciaId: number;
    name: string;
    description: string;
    price: number;
    isVeggie: boolean;
    imageUrl: string;
    imagePublicId: string;
    featured: boolean;
    cantidad: number;
};

export type Pedido = {
    id: number;
    clientPhone: string;
    pedidoFocaccias: PedidoFocacciaResponse[];
    quantity: number;
    totalPrice: number;
    orderDate: string;
};

export type ApiResponse<T> = {
    data: T;
    message: string;
    success: boolean;
}