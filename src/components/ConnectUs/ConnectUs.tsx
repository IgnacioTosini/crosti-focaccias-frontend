import { ConnectCard } from '../ConnectCard/ConnectCard'
import './_connectUs.scss'

export const ConnectUs = () => {
  return (
    <div className='connectUs'>
      <h2 className='connectUsTitle'>¡Conectemos!</h2>
      <div className='connectCardsContainer'>
        <ConnectCard title='WhatsApp' description='Enviar mensaje' iconUrl='WhatsApp' link='https://wa.me/1234567890' />
        <ConnectCard title='Instagram' description='@crosti.focaccias' iconUrl='Instagram' link='https://www.instagram.com/crosti.focaccias' />
        <ConnectCard title='Ubicación' description='Mar del Plata' iconUrl='Map' />
      </div>
    </div>
  )
}
