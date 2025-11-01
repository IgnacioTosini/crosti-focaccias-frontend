import { useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Modal } from '../Modal/Modal'
import type { FocacciaItem } from '../../types'
import { ItemCategory } from '../ItemCategory/ItemCategory'
import { usePedidoContext } from '../../context/pedidoContext'
import './_itemCard.scss'

type ItemCardProps = {
  focaccia: FocacciaItem
}

export const ItemCard = ({ focaccia }: ItemCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart } = usePedidoContext();

  const handleAddToCart = () => {
    addToCart(focaccia);
  };

  return (
    <>
      <div className='itemCard'>
        <picture className='itemImageContainer' onClick={() => setModalOpen(true)}>
          <img src={focaccia.imageUrl} alt={focaccia.name} className='itemImage' />
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
