import { useState, useEffect, useRef } from 'react';
import { ChatbotService, type ChatMessage } from '../../services/ChatbotService';
import { QUICK_REPLIES, CHATBOT_CONFIG } from '../../config/chatbotConfig';
import './_chatbot.scss';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tomar solo las primeras N preguntas según configuración
    const quickReplies = QUICK_REPLIES.slice(0, CHATBOT_CONFIG.maxQuickRepliesToShow);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Mensaje de bienvenida al abrir por primera vez
            setMessages([ChatbotService.getWelcomeMessage()]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        // Auto-scroll al último mensaje
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (text?: string) => {
        const messageText = text || inputValue.trim();

        if (!messageText) return;

        // Agregar mensaje del usuario
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Obtener respuesta del bot
            const botResponse = await ChatbotService.sendMessage(messageText);
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsTyping(false);
        }
    };

    /*     const handleKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        }; */

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chatbotContainer">
            {!isOpen && (
                <>
                    <div className="chatbotTooltip">
                        ¿Tenés dudas? ¡Preguntame! 💬
                    </div>
                    <button
                        className="chatbotButton"
                        onClick={() => setIsOpen(true)}
                        aria-label="Abrir chat"
                    >
                        <img src={CHATBOT_CONFIG.theme.botAvatar} alt="Chatbot" />
                    </button>
                </>
            )}

            {isOpen && (
                <div className="chatbotWindow">
                    <div className="chatbotHeader">
                        <div>
                            <h3>Asistente Virtual</h3>
                            <div className="status">
                                <span className="statusDot"></span>
                                <span>En línea</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
                            ×
                        </button>
                    </div>

                    <div className="chatbotMessages">
                        {messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender}`}>
                                <div className={`messageAvatar ${message.sender}Avatar`}>
                                    {message.sender === 'bot'
                                        ? <img src={CHATBOT_CONFIG.theme.botAvatar} alt="Bot" />
                                        : CHATBOT_CONFIG.theme.userAvatar
                                    }
                                </div>
                                <div className="messageContent">
                                    <div className="messageBubble">
                                        {message.text.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                {i < message.text.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="messageTime">
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot">
                                <div className="messageAvatar botAvatar">🤖</div>
                                <div className="typingIndicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {!isTyping && (
                        <div className="quickReplies">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSendMessage(reply.text)}
                                    title={reply.category}
                                >
                                    {reply.icon && <span className="quickReplyIcon">{reply.icon}</span>}
                                    {reply.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {/*                     <div className="chatbotInput">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu mensaje..."
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            aria-label="Enviar mensaje"
                        >
                            ➤
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
};
