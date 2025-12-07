import axios from "axios";
import type { Pedido, PedidoRequest, ApiResponse } from "../types";
import { env } from '../config/env';

const BASE_URL = env.VITE_BASE_URL?.replace('/focaccias', '/pedidos') || 'http://localhost:8080/api/pedidos';

export class PedidoService {

    static async createPedido(pedidoData: PedidoRequest): Promise<ApiResponse<Pedido>> {
        const response = await axios.post(BASE_URL, pedidoData);
        return response.data;
    }

    static async getPedidos(): Promise<ApiResponse<Pedido[]>> {
        const response = await axios.get(BASE_URL);
        return response.data;
    }

    static async getPedidoById(id: number): Promise<ApiResponse<Pedido>> {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    static async deletePedido(id: number): Promise<ApiResponse<Pedido>> {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    }

    static async getPedidosByClientPhone(clientPhone: string): Promise<ApiResponse<Pedido[]>> {
        const response = await axios.get(`${BASE_URL}/buscar/telefono/${encodeURIComponent(clientPhone)}`);
        return response.data;
    }
}