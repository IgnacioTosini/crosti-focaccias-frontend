import { useEffect, useState } from 'react';
import { useFocacciaContext } from '../../context/focacciaContext';
import { FaRegLightbulb } from 'react-icons/fa6'
import { ItemCard } from '../ItemCard/ItemCard'
import { SmartLoading } from '../SmartLoading/SmartLoading'
import type { FocacciaItem } from '../../types';
import { animateOurMenu } from '../../animations';
import './_ourMenu.scss'

export const OurMenu = () => {
  const { focaccias, isLoading, isLoadingMore, loadMoreFocaccias } = useFocacciaContext();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isLoading && focaccias && focaccias.length > 0) {
      animateOurMenu();
    }
  }, [isLoading, focaccias]);

  // Determinar el estado de carga basado en si tenemos datos o no
  const hasData = focaccias && focaccias.length > 0;
  const showLoadingMessage = isLoading && !hasData;
  const showSkeletonLoading = isLoading && hasData;

  // Mostrar solo los primeros 4 inicialmente, luego todos si se solicita
  const displayedFocaccias = showAll ? focaccias : focaccias.slice(0, 4);
  const hasMoreToShow = focaccias.length > 4 && !showAll;

  const handleLoadMore = async () => {
    if (hasMoreToShow) {
      setShowAll(true);
    } else {
      // Si ya mostramos todos los locales, cargar más del servidor
      await loadMoreFocaccias();
    }
  };

  return (
    <div className='ourMenu'>
      <h2 className='ourMenuTitle'>Nuestras Focaccias</h2>

      <div className='menuItemsContainer'>
        {showLoadingMessage ? (
          <SmartLoading
            type="initial"
            message="Cargando nuestras deliciosas focaccias..."
          />
        ) : showSkeletonLoading ? (
          // Mostrar contenido actual + loading para actualizaciones
          <>
            {focaccias.map((focaccia: FocacciaItem) =>
              focaccia ? <ItemCard key={focaccia.id} focaccia={focaccia} /> : null
            )}
            <SmartLoading type="more" />
          </>
        ) : hasData ? (
          <>
            {displayedFocaccias.map((focaccia: FocacciaItem) =>
              focaccia ? <ItemCard key={focaccia.id} focaccia={focaccia} /> : null
            )}

            {/* Botón para cargar más */}
            {(hasMoreToShow || focaccias.length === 4) && (
              <div className='loadMoreContainer'>
                <button
                  className='loadMoreButton'
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <span className="loadingSpinner">🔄</span>
                      Cargando...
                    </>
                  ) : hasMoreToShow ? (
                    `Ver ${focaccias.length - 4} focaccias más`
                  ) : (
                    'Ver todas las focaccias'
                  )}
                </button>
              </div>
            )}

            {/* Mostrar loading mientras carga más productos */}
            {isLoadingMore && (
              <SmartLoading type="skeleton" count={3} />
            )}
          </>
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
