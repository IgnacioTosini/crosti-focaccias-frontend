import { useState, useEffect, useRef } from 'react';
import { usePedidoContext } from '../../context/pedidoContext';
import { FaShoppingCart } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { ItemCardInOrder } from '../ItemCardInOrder/ItemCardInOrder';
import { BiTrash } from 'react-icons/bi';
import { FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { animateAsideOrderSummaryOpen, animateAsideOrderSummaryClose } from '../../animations';
import './_asideOrderSummary.scss';

export const AsideOrderSummary = () => {
    const { preOrder, clearPreOrder, setIsOpen, createPedido } = usePedidoContext();
    const [clientPhone, setClientPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isSendingOrder, setIsSendingOrder] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (panelRef.current && overlayRef.current) {
            animateAsideOrderSummaryOpen(panelRef.current, overlayRef.current);
        }
    }, []);

    const handleClose = () => {
        if (isClosing || !panelRef.current || !overlayRef.current) return;

        setIsClosing(true);
        animateAsideOrderSummaryClose(panelRef.current, overlayRef.current, () => {
            setIsOpen(false);
            setIsClosing(false);
        });
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleMenuClick = () => {
        handleClose();
        setTimeout(() => {
            window.location.href = "#menu";
        }, 400);
    };

    const isValidPhone = (phone: string) => {
        // Solo números, al menos 10 dígitos
        const phoneRegex = /^\d{10,}$/;
        return phoneRegex.test(phone);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Solo permitir números
        const numbersOnly = value.replace(/\D/g, '');
        setClientPhone(numbersOnly);
        
        // Validar y mostrar error
        if (numbersOnly.length > 0 && numbersOnly.length < 10) {
            setPhoneError('El número debe tener al menos 10 dígitos');
        } else if (numbersOnly.length > 15) {
            setPhoneError('El número no puede tener más de 15 dígitos');
        } else {
            setPhoneError('');
        }
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
        // Prevenir múltiples clicks
        if (isSendingOrder) return;

        if (!isValidPhone(clientPhone)) {
            setPhoneError('Por favor, ingresa un número de teléfono válido (mínimo 10 dígitos)');
            return;
        }

        setIsSendingOrder(true);

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
            setPhoneError('');
            handleClose();
        } catch (error) {
            toast.error('Error al guardar el pedido');
            console.error(error);
            setIsSendingOrder(false);
        }
    };

    return (
        <div className='asideOrderSummaryOverlay' ref={overlayRef} onClick={handleOverlayClick}>
            <div className='asideOrderSummary' ref={panelRef}>
                <div className='asideOrderSummaryHeader'>
                    <div className='asideOrderSummaryTitle'>
                        <FaShoppingCart className='asideOrderSummaryIcon' /> <p className='asideOrderSummaryText'>Tu pedido {<span className='asideOrderSummaryNumber'>{preOrder.quantity}</span>}</p>
                    </div>
                    <IoClose onClick={handleClose} className='asideOrderSummaryCloseButton' />
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
                                placeholder='1112345678 (solo números)'
                                value={clientPhone}
                                onChange={handlePhoneChange}
                                className={`phoneInput ${phoneError ? 'error' : ''}`}
                                maxLength={15}
                            />
                            {phoneError && <span className='phoneError'>{phoneError}</span>}
                        </div>
                        <button
                            className='asideOrderSummaryButton'
                            onClick={handleSendWhatsApp}
                            disabled={!isValidPhone(clientPhone) || isSendingOrder}
                        >
                            <FiMessageCircle />
                            <span>{isSendingOrder ? 'Enviando...' : 'Enviar pedido por WhatsApp'}</span>
                        </button>
                        <span className='asideOrderSummaryDisclaimer'>Te llevará a WhatsApp con tu pedido completo</span>
                    </div>
                )}
            </div>
        </div>
    )
}
