import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { BiHeart } from 'react-icons/bi'
import { handleInstagramClick, handleWhatsAppClick } from '../../utils'
import './_footer.scss'

export const Footer = () => {
  return (
    <div className='footer'>
      <div className='footerTop'>
        <picture className='footerLogo'>
          <img src="/CrostiSinFondo.png" alt="Logo de Crosti" />
          <figcaption>Crosti Focaccias</figcaption>
        </picture>
        <div className='footerLinks'>
          <FaInstagram className='footerIcon instagram' onClick={handleInstagramClick} />
          <FaWhatsapp className='footerIcon whatsapp' onClick={handleWhatsAppClick} />
        </div>
        <p className='footerCredit'>Hecho con amor en Mar del Plata <BiHeart className='heartIcon' /></p>
      </div>
      <div className='footerBottom'>
        <p>© {new Date().getFullYear()} Crosti Focaccias. Todos los derechos reservados.</p>
        <span>Creado por Ignacio Tosini</span>
      </div>
    </div>
  )
}
