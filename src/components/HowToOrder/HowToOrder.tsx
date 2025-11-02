import { useEffect } from 'react';
import { FiMessageCircle } from 'react-icons/fi'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { animateHowToOrder } from '../../animations';
import './_howToOrder.scss'

export const HowToOrder = () => {
  useEffect(() => {
    animateHowToOrder();
  }, []);

  return (
    <div className='howToOrder'>
      <h2 className='howToOrderTitle'>¿Cómo Pedir?</h2>
      <div className='howToOrderSteps'>
        <div className='step'>
          <h3 className='stepTitle'><FiMessageCircle className='stepIconContact'/><span>Contacto</span></h3>
          <p className='stepDescription'>• WhatsApp o Instagram DM.</p>
          <p className='stepDescription'>• Tomamos pedidos para el finde</p>
          <p className='stepDescription'>• Confirma tu pedido con anticipación</p>
        </div>
        <div className='step'>
          <h3 className='stepTitle'><FaMapMarkerAlt className='stepIconMap'/><span>Entrega</span></h3>
          <p className='stepDescription'>• Zonas de entrega en Mar del Plata.</p>
          <p className='stepDescription'>• Opción de retiro disponible</p>
          <p className='stepDescription'>• Varios medios de pago aceptados</p>
        </div>
      </div>
    </div>
  )
}
