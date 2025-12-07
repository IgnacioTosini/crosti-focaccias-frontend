import { z } from 'zod';

/**
 * Schema de validación para el teléfono del cliente
 */
export const phoneSchema = z.string()
    .regex(/^\d+$/, 'Solo se permiten números')
    .min(10, 'El número debe tener al menos 10 dígitos')
    .max(15, 'El número no puede tener más de 15 dígitos')
    .transform(val => val.trim());

/**
 * Schema de validación para una focaccia en el pedido
 */
export const pedidoFocacciaSchema = z.object({
    focacciaId: z.number()
        .positive('ID de focaccia inválido')
        .int('ID debe ser un número entero'),
    cantidad: z.number()
        .min(1, 'La cantidad debe ser al menos 1')
        .max(20, 'No puedes pedir más de 100 unidades')
        .int('La cantidad debe ser un número entero')
});

/**
 * Schema completo de validación para crear un pedido
 */
export const createPedidoSchema = z.object({
    clientPhone: phoneSchema,
    focaccias: z.array(pedidoFocacciaSchema)
        .min(1, 'Debes agregar al menos una focaccia al pedido')
        .max(20, 'No puedes agregar más de 50 items diferentes')
});

/**
 * Schema para validar el pedido completo con información de precio
 */
export const fullPedidoSchema = createPedidoSchema.extend({
    totalPrice: z.number()
        .min(0, 'El precio total no puede ser negativo'),
    quantity: z.number()
        .min(1, 'La cantidad total debe ser al menos 1')
});

/**
 * Tipos inferidos de los schemas
 */
export type PhoneValidation = z.infer<typeof phoneSchema>;
export type PedidoFocacciaValidation = z.infer<typeof pedidoFocacciaSchema>;
export type CreatePedidoValidation = z.infer<typeof createPedidoSchema>;
export type FullPedidoValidation = z.infer<typeof fullPedidoSchema>;
