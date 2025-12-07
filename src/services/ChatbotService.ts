import axios from 'axios';
import { env } from '../config/env';

const BASE_URL = env.VITE_BASE_URL?.replace('/api/focaccias', '') || 'http://localhost:8080';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

export interface ChatResponse {
    message: string;
    conversationId: string;
    success: boolean;
}

class ChatbotServiceClass {
    private conversationId: string | null = null;

    /**
     * Envía un mensaje al chatbot y obtiene respuesta
     */
    async sendMessage(message: string): Promise<ChatMessage> {
        try {
            const request: ChatRequest = {
                message,
                conversationId: this.conversationId || undefined
            };

            const response = await axios.post<ChatResponse>(
                `${BASE_URL}/api/chatbot/message`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            // Guardar ID de conversación
            this.conversationId = response.data.conversationId;

            // Retornar mensaje formateado
            return {
                id: Date.now().toString(),
                text: response.data.message,
                sender: 'bot',
                timestamp: new Date()
            };

        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number; data?: unknown; headers?: unknown }; config?: unknown };
            console.error('Error al comunicarse con el chatbot:', axiosError);

            // Mensaje de error amigable
            return {
                id: Date.now().toString(),
                text: 'Lo siento, estoy teniendo problemas para responder. ¿Puedes intentar de nuevo? 🤖',
                sender: 'bot',
                timestamp: new Date()
            };
        }
    }

    /**
     * Reinicia la conversación
     */
    resetConversation(): void {
        this.conversationId = null;
    }

    /**
     * Obtiene un mensaje de bienvenida
     */
    getWelcomeMessage(): ChatMessage {
        return {
            id: 'welcome',
            text: '¡Hola! 👋 Soy el asistente virtual de Crosti Focaccias.\n\nPuedes escribir tu pregunta o seleccionar una de las opciones de abajo:',
            sender: 'bot',
            timestamp: new Date()
        };
    }
}

export const ChatbotService = new ChatbotServiceClass();
