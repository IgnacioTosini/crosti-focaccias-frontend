import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoCartOutline, IoPersonOutline } from 'react-icons/io5';
import { usePedidoContext } from '../../context/pedidoContext';
import { getApiKeyFromUrl } from '../../services/ProductService';
import { usePrefetchOnHover } from '../../hooks/usePrefetchOnHover';
import { animateHeader } from '../../animations';
import './_header.scss'

export const Header = () => {
  const { setIsOpen, preOrder } = usePedidoContext();
  const apiKey = useMemo(() => getApiKeyFromUrl(), []);
  const { handleMouseEnter, handleMouseLeave } = usePrefetchOnHover();

  useEffect(() => {
    animateHeader();
  }, []);

  return (
    <div className='header'>
      <div className='logoContainer'>
        <img src="./LogoCrosti.png" alt="Crosti Logo" />
        <h1>Crosti</h1>
      </div>
      <nav className='navLinks'>
        <ul>
          <li>
            <a 
              href="#menu"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Menú
            </a>
          </li>
          <li><a href="#sobre-nosotros">Sobre nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <div className='buttonsContainer'>
          <button className='primaryButton' onClick={() => setIsOpen(true)}><IoCartOutline /><span>Carrito</span><span>{preOrder.quantity}</span></button>
          {apiKey === import.meta.env.VITE_SECRET_API_KEY && <Link to={`/abm?apiKey=${import.meta.env.VITE_SECRET_API_KEY}`} className='secondaryButton'><IoPersonOutline /><span>Admin</span></Link>}
        </div>
      </nav>
    </div>
  )
}
