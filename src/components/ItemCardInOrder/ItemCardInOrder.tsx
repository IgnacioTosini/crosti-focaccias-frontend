import { TbTrash } from 'react-icons/tb';
import type { PedidoFocaccia } from '../../types';
import { usePedidoContext } from '../../context/pedidoContext';
import './_itemCardInOrder.scss';

type ItemCardInOrderProps = {
    item: PedidoFocaccia;
    index: number;
}

export const ItemCardInOrder = ({ item, index }: ItemCardInOrderProps) => {
    const { addToCart, removeFromCart, lessQuantityToItem } = usePedidoContext();

    const handleAddToCart = () => {
        addToCart(item.focaccia);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(item.focaccia.id);
    };

    const handleLessQuantity = () => {
        lessQuantityToItem(item.focaccia.id);
    };

    return (
        <li key={index} className='itemCardInOrder'>
            <div className='itemDetails'>
                <p className='itemName'>{item.focaccia.name}</p>
                <p className='itemDescription'>{item.focaccia.description}</p>
            </div>
            <div className='itemPrice'>
                <p>$ {item.focaccia.price}</p>
            </div>
            <div className='itemQuantityContainer'>
            <div className='itemQuantity'>
                <button className='itemQuantityButton' onClick={handleLessQuantity}>-</button>
                <span className='itemQuantityValue'>{item.cantidad}</span>
                <button className='itemQuantityButton' onClick={handleAddToCart}>+</button>
            </div>
            <p className='itemQuantityPrice'>{item.cantidad} x ${item.focaccia.price}</p>
            </div>
            <TbTrash className='itemDeleteIcon' onClick={handleRemoveFromCart} />
        </li>
    )
}
