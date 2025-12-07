import { z } from 'zod';

/**
 * Schema de validación para variables de entorno
 * Valida que todas las variables requeridas estén presentes y sean válidas
 */
const envSchema = z.object({
    // URLs de API
    VITE_BASE_URL: z.string()
        .url('VITE_BASE_URL debe ser una URL válida')
        .optional()
        .default('http://localhost:8080/api/focaccias'),

    // WhatsApp
    VITE_WHATSAPP_NUMBER: z.string()
        .regex(/^\d+$/, 'VITE_WHATSAPP_NUMBER debe contener solo números')
        .min(10, 'VITE_WHATSAPP_NUMBER debe tener al menos 10 dígitos')
        .optional(),

    // Cloudinary
    VITE_CLOUDINARY_CLOUD_NAME: z.string()
        .min(1, 'VITE_CLOUDINARY_CLOUD_NAME es requerido')
        .optional(),

    VITE_CLOUDINARY_UPLOAD_PRESET: z.string()
        .min(1, 'VITE_CLOUDINARY_UPLOAD_PRESET es requerido')
        .optional(),

    // Modo de desarrollo
    DEV: z.boolean().optional(),
    PROD: z.boolean().optional(),
    MODE: z.enum(['development', 'production', 'test']).optional()
});

/**
 * Valida y exporta las variables de entorno
 * Lanza un error si alguna variable requerida falta o es inválida
 */
function validateEnv() {
    try {
        return envSchema.parse(import.meta.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Error en variables de entorno:');
            error.issues.forEach((err: z.ZodIssue) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            // En desarrollo, mostrar error pero continuar
            // En producción, podrías querer lanzar el error
            if (import.meta.env.PROD) {
                throw new Error('Variables de entorno inválidas. Verifica la configuración.');
            }
        }
        // Retornar valores por defecto en caso de error
        return {
            VITE_BASE_URL: 'http://localhost:8080/api/focaccias',
            DEV: import.meta.env.DEV,
            PROD: import.meta.env.PROD,
            MODE: import.meta.env.MODE
        } as Env;
    }
}

export const env = validateEnv();

/**
 * Type-safe access to environment variables
 */
export type Env = z.infer<typeof envSchema>;
