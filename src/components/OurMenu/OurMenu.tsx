import { useEffect } from 'react';
import { useFocacciaContext } from '../../context/focacciaContext';
import { FaRegLightbulb } from 'react-icons/fa6'
import { ItemCard } from '../ItemCard/ItemCard'
import { ItemCardSkeleton } from '../ItemCard/ItemCardSkeleton'
import type { FocacciaItem } from '../../types';
import { animateOurMenu } from '../../animations';
import './_ourMenu.scss'

export const OurMenu = () => {
  const { focaccias, isLoading } = useFocacciaContext();

  useEffect(() => {
    if (!isLoading && focaccias && focaccias.length > 0) {
      animateOurMenu();
    }
  }, [isLoading, focaccias]);

  return (
    <div className='ourMenu'>
      <h2 className='ourMenuTitle'>Nuestras Focaccias</h2>

      <div className='menuItemsContainer'>
        {isLoading ? (
          // Mostrar skeleton loading mientras carga
          Array.from({ length: 6 }, (_, index) => (
            <ItemCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : focaccias && focaccias.length > 0 ? (
          focaccias.map((focaccia: FocacciaItem) =>
            focaccia ? <ItemCard key={focaccia.id} focaccia={focaccia} /> : null
          )
        ) : (
          <div className='emptyState'>
            <p>No hay focaccias disponibles en este momento.</p>
            <p>¡Vuelve pronto para ver nuestras deliciosas opciones!</p>
          </div>
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
