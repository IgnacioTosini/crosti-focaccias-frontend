/**
 * Configuración centralizada del chatbot
 * Define las preguntas rápidas y sus categorías
 */

export interface QuickReply {
    text: string;
    category: string;
    icon?: string;
}

/**
 * Preguntas rápidas que aparecen en el chatbot
 * Ordenadas por importancia/frecuencia de uso
 */
export const QUICK_REPLIES: QuickReply[] = [
    {
        text: '¿Qué focaccias tienen?',
        category: 'MENU',
        icon: '🍕'
    },
    {
        text: '¿Tienen opciones veganas?',
        category: 'VEGANAS',
        icon: '🌱'
    },
    {
        text: '¿Cuánto cuesta?',
        category: 'PRECIOS',
        icon: '💰'
    },
    {
        text: '¿Cómo hago un pedido?',
        category: 'PEDIDOS',
        icon: '🛒'
    },
    {
        text: '¿Hacen delivery?',
        category: 'DELIVERY',
        icon: '🚚'
    },
    {
        text: '¿Qué ingredientes usan?',
        category: 'INGREDIENTES',
        icon: '🌿'
    },
    {
        text: '¿Cuál es el horario?',
        category: 'HORARIOS',
        icon: '🕐'
    },
    {
        text: '¿Dónde están ubicados?',
        category: 'UBICACION',
        icon: '📍'
    }
];

/**
 * Configuración del mensaje de bienvenida
 */
export const WELCOME_MESSAGE = {
    text: '¡Hola! 👋 Soy el asistente virtual de Crosti Focaccias. ¿En qué puedo ayudarte hoy?',
    sender: 'bot' as const
};

/**
 * Configuración visual del chatbot
 */
export const CHATBOT_CONFIG = {
    maxQuickRepliesToShow: 8, // Número máximo de preguntas a mostrar a la vez (mostrar todas)
    typingDelay: 800, // Milisegundos de delay simulado para "escribiendo..."
    enableSound: false, // Sonido al recibir mensaje
    theme: {
        primaryColor: '#ff6b35',
        secondaryColor: '#f7931e',
        botAvatar: '/CrostiSinFondo.png',
        userAvatar: '👤'
    }
};

/**
 * Textos de la interfaz
 */
export const UI_TEXTS = {
    header: 'Asistente Virtual',
    status: 'En línea',
    inputPlaceholder: 'Escribe tu mensaje...',
    sendButtonLabel: 'Enviar mensaje',
    closeButtonLabel: 'Cerrar chat',
    openButtonLabel: 'Abrir chat'
};
