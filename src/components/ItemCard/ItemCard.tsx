import { useState, useEffect, useRef } from 'react'
import { BiCart } from 'react-icons/bi'
import { Modal } from '../Modal/Modal'
import type { FocacciaItem } from '../../types'
import { ItemCategory } from '../ItemCategory/ItemCategory'
import { usePedidoContext } from '../../context/pedidoContext'
import { animateItemCard } from '../../animations'
import './_itemCard.scss'

type ItemCardProps = {
  focaccia: FocacciaItem
}

export const ItemCard = ({ focaccia }: ItemCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { addToCart } = usePedidoContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      animateItemCard(cardRef.current);
    }
  }, []);

  // Cargar imagen inmediatamente cuando tenemos URL
  useEffect(() => {
    if (focaccia.imageUrl && !imageLoaded && !imageError) {
      const img = new Image();

      img.onload = () => {
        setImageLoaded(true);
        setShowSkeleton(false);
      };

      img.onerror = () => {
        setImageError(true);
        setShowSkeleton(false);
      };

      // Cargar inmediatamente sin delay
      img.src = focaccia.imageUrl;
    }
  }, [focaccia.imageUrl, imageLoaded, imageError]);

  const handleAddToCart = () => {
    addToCart(focaccia);
  };

  return (
    <>
      <div className='itemCard' ref={cardRef}>
        <picture className='itemImageContainer' onClick={() => setModalOpen(true)}>
          {showSkeleton && !imageLoaded && !imageError && (
            <div className='imageSkeleton'>
              <div className='skeletonShimmer'></div>
            </div>
          )}
          <img
            ref={imgRef}
            src={imageLoaded ? focaccia.imageUrl : ''}
            alt={focaccia.name}
            className={`itemImage ${imageLoaded ? 'loaded' : ''}`}
            style={{
              display: imageLoaded ? 'block' : 'none',
              opacity: imageLoaded ? 1 : 0,
              transition: 'all 0.3s ease-in-out'
            }}
          />
          {imageError && (
            <div className='imageError'>
              <span>⚠️ Error al cargar imagen</span>
            </div>
          )}
          {!imageLoaded && !imageError && !showSkeleton && (
            <div className='imagePlaceholder'>
              <div className='placeholderIcon'>🍕</div>
            </div>
          )}
        </picture>
        <h3 className='itemName'>{focaccia.name}</h3>
        <p className='itemDescription'>{focaccia.description}</p>
        <div className='itemCardFooter'>
          <p className='itemPrice'>${focaccia.price}</p>
          <button className='addToCartButton' onClick={handleAddToCart}><BiCart /> Agregar</button>
        </div>
        {focaccia.featured && <span className='itemFeature'>¡Destacado!</span>}
        {focaccia.isVeggie && <ItemCategory focaccia={focaccia} />}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageSrc={focaccia.imageUrl} />
    </>
  )
}
