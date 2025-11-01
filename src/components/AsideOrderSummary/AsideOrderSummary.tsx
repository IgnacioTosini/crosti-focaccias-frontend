import { useState } from 'react';
import { usePedidoContext } from '../../context/pedidoContext';
import { FaShoppingCart } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { ItemCardInOrder } from '../ItemCardInOrder/ItemCardInOrder';
import { BiTrash } from 'react-icons/bi';
import { FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './_asideOrderSummary.scss';

export const AsideOrderSummary = () => {
    const { preOrder, clearPreOrder, setIsOpen, createPedido } = usePedidoContext();
    const [clientPhone, setClientPhone] = useState('');

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const handleMenuClick = () => {
        setIsOpen(false);
        window.location.href = "#menu";
    };

    const isValidPhone = (phone: string) => {
        // Valida que tenga al menos 10 dígitos
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    };

    const generateOrderMessage = () => {
        let message = `CROSTI FOCACCIAS\n`;
        message += `Nuevo Pedido\n\n`;
        message += `================================\n`;
        message += `DETALLE DEL PEDIDO\n`;
        message += `================================\n\n`;

        preOrder.pedidoFocaccias.forEach((item, index) => {
            message += `${index + 1}. ${item.focaccia.name}\n`;
            message += `   Cantidad: x${item.cantidad}\n`;
            message += `   Precio unit: $${item.focaccia.price.toFixed(2)}\n`;
            message += `   Subtotal: $${(item.focaccia.price * item.cantidad).toFixed(2)}\n\n`;
        });

        message += `================================\n`;
        message += `TOTAL A PAGAR: $${preOrder.totalPrice.toFixed(2)}\n`;
        message += `================================\n\n`;
        message += `Mi telefono de contacto:\n${clientPhone}\n\n`;
        message += `Muchas gracias!`;
        
        return message;
    };

    const handleSendWhatsApp = async () => {
        if (!isValidPhone(clientPhone)) {
            toast.error('Por favor, ingresa un número de teléfono válido');
            return;
        }

        // Guardar el pedido en BD
        const pedidoData = {
            clientPhone: clientPhone.trim(),
            focaccias: preOrder.pedidoFocaccias.map(item => ({
                focacciaId: item.focaccia.id,
                cantidad: item.cantidad
            }))
        };

        try {
            await createPedido(pedidoData);

            const message = generateOrderMessage();
            const businessWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER;

            // Abrir WhatsApp del negocio con el mensaje del cliente
            const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            toast.success('Pedido guardado exitosamente. ¡Serás redirigido a WhatsApp!');
            setClientPhone('');
            setIsOpen(false);
        } catch (error) {
            toast.error('Error al guardar el pedido');
            console.error(error);
        }
    };

    return (
        <div className='asideOrderSummaryOverlay' onClick={handleOverlayClick}>
            <div className='asideOrderSummary'>
                <div className='asideOrderSummaryHeader'>
                    <div className='asideOrderSummaryTitle'>
                        <FaShoppingCart className='asideOrderSummaryIcon' /> <p className='asideOrderSummaryText'>Tu pedido {<span className='asideOrderSummaryNumber'>{preOrder.quantity}</span>}</p>
                    </div>
                    <IoClose onClick={() => setIsOpen(false)} className='asideOrderSummaryCloseButton' />
                </div>

                <div className='asideOrderSummaryContent'>
                    {preOrder.pedidoFocaccias.length === 0 ? (
                        <div className='emptyCartMessage'>
                            <FaShoppingCart className='emptyCartIcon' />
                            <p>No hay items en el pedido.</p>
                            <span>Agrega algunos productos para continuar.</span>
                            <button className='emptyCartButton' onClick={handleMenuClick}>Ver menú</button>
                        </div>
                    ) : (
                        <>
                            <ul className='asideOrderSummaryList'>
                                {preOrder.pedidoFocaccias.map((item, index) => (
                                    <ItemCardInOrder key={index} item={item} index={index} />
                                ))}
                            </ul>
                            <button className='asideOrderSummaryButton delete' onClick={clearPreOrder}><BiTrash /> Vaciar pedido</button>
                        </>
                    )}
                </div>

                {preOrder.pedidoFocaccias.length > 0 && (
                    <div className='asideOrderSummaryFooter'>
                        <p className='asideOrderSummaryTotal'>Total: ${preOrder.totalPrice.toFixed(2)}</p>
                        <div className='phoneInputContainer'>
                            <label htmlFor='clientPhone'>Tu número de WhatsApp:</label>
                            <input
                                type='tel'
                                id='clientPhone'
                                placeholder='+54 9 11 1234-5678'
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                className='phoneInput'
                            />
                        </div>
                        <button
                            className='asideOrderSummaryButton'
                            onClick={handleSendWhatsApp}
                            disabled={!isValidPhone(clientPhone)}
                        >
                            <FiMessageCircle /><span>Enviar pedido por WhatsApp</span>
                        </button>
                        <span className='asideOrderSummaryDisclaimer'>Te llevará a WhatsApp con tu pedido completo</span>
                    </div>
                )}
            </div>
        </div>
    )
}
