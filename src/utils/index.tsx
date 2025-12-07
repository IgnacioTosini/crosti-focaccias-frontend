import { env } from '../config/env';

export const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${env.VITE_WHATSAPP_NUMBER || ''}`, '_blank');
};

export const handleInstagramClick = () => {
    window.open('https://www.instagram.com/crosti.focaccias', '_blank');
};