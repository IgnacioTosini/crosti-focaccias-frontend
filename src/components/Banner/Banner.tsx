import { IoCartOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { handleWhatsAppClick } from '../../utils'
import './_banner.scss'

export const Banner = () => {

  return (
    <div className="banner">
      <img
        className="bannerImage"
        src="/CrostiSinFondo.png"
        alt="Banner de focaccias"
      />
      <div className="bannerText">
        <h1 className="bannerTitle">La ola de sabor en
          <span>La Feliz 🌊</span>
        </h1>
        <p className="bannerSubtitle">Focaccias caseras hechas en el día</p>
      </div>
      <div className='buttonsContainer'>
        <button className='menuButton'><a href="#menu"><IoCartOutline /><span>Ver Menú</span></a></button>
        <button className='whatsappButton' onClick={handleWhatsAppClick}><IoLogoWhatsapp /><span>WhatsApp</span></button>
      </div>
    </div>
  )
}
