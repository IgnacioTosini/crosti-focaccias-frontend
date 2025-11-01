
import { useContext } from 'react';
import { FocacciaContext } from '../../context/focacciaContext';
import { FaRegLightbulb } from 'react-icons/fa6'
import { ItemCard } from '../ItemCard/ItemCard'
import type { FocacciaItem } from '../../types';
import './_ourMenu.scss'

export const OurMenu = () => {
  const { focaccias, isLoading } = useContext(FocacciaContext);
  return (
    <div className='ourMenu'>
      <h2 className='ourMenuTitle'>Nuestras Focaccias</h2>

      <div className='menuItemsContainer'>
        {isLoading && <div>Cargando...</div>}
        {!isLoading && focaccias && focaccias.length > 0 ? (
          focaccias.map((focaccia: FocacciaItem) =>
            focaccia ? <ItemCard key={focaccia.id} focaccia={focaccia} /> : null
          )
        ) : null}
        {!isLoading && focaccias && focaccias.length === 0 && (
          <div>No hay focaccias disponibles.</div>
        )}
      </div>

      <div className='extraInfo'>
        <FaRegLightbulb />
        <div className='extraInfoContent'>
          <h4>Extra info:</h4>
          <p>Son tamaño grande. Si te sobra (¡que lo dudamos!), podés congelarla hasta por 60 días ❄️</p>
        </div>
      </div>
    </div>
  )
}
