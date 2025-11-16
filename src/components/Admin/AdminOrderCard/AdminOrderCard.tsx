import { usePedidoContext } from '../../../context/pedidoContext';
import { BiTrash } from 'react-icons/bi';
import type { Pedido } from '../../../types';
import './_adminOrderCard.scss';

type AdminOrderCardProps = {
    order: Pedido;
}

export const AdminOrderCard = ({ order }: AdminOrderCardProps) => {
    const { deletePedido } = usePedidoContext();
    return (
        <div className='adminOrderCard'>
            <div className='adminOrderCardContent'>
                <div className='adminOrderCardHeader'>
                    <h2 className='adminOrderId'>El pedido {order.id}</h2>
                    <span className='adminOrderClientPhone'>Número del cliente: {order.clientPhone}</span>
                    <p className='adminOrderQuantity'>Total de Productos: {order.quantity}</p>
                    <span className='adminOrderTotalPrice'>Total del pedido: $ {order.totalPrice}</span>
                    <span className='adminOrderDate'>Fecha del pedido: {new Date(order.orderDate).toLocaleDateString()}</span>
                </div>

                <div className='adminOrderFocaccias'>
                    <h3>Focaccias en el pedido:</h3>
                    <ul className='adminOrderFocacciasList'>
                        {order.pedidoFocaccias.map((pf) => (
                            <li key={pf.focacciaId} className='adminOrderFocacciaItem'>
                                <span className='focacciaName'>{pf.name}</span>
                                <span className='focacciaQuantity'>Cantidad: {pf.cantidad}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button 
                    className='adminOrderDeleteButton' 
                    onClick={() => deletePedido(order.id)}
                    aria-label={`Eliminar pedido ${order.id}`}
                >
                    <BiTrash />
                </button>
            </div>
        </div>
    )
}
