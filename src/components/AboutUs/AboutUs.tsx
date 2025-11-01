import { IoLeafSharp } from 'react-icons/io5'
import './_aboutUs.scss'

export const AboutUs = () => {
  return (
    <div className='aboutUsContainer'>
      <h2 className='aboutUsTitle'>Sobre Crosti</h2>
      <div className='textImageContainer'>
        <div className='textContainer'>
          <p className='aboutUsText'>Crosti nació del amor por la cocina artesanal y la pasión por crear momentos especiales alrededor de la mesa. Cada focaccia es preparada con masa madre, ingredientes frescos y el cariño de siempre.</p>
          <p className='aboutUsText'>Desde Mar del Plata, llevamos el sabor auténtico de Italia a tu hogar, con opciones que cuidan tanto el paladar como las preferencias de cada familia.</p>

          <span className='aboutUsText leafText'><IoLeafSharp className='leaf'/>100% opciones veggie disponibles</span>
        </div>
        <picture className='imageContainer'>
          <img src='/LogoCrosti.png' alt='Logo de Crosti' />
          <span className='aboutUsText'>Hecho con amor y tradición</span>
        </picture>
      </div>
    </div>
  )
}
