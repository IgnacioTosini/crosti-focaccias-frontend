import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useFocacciaContext } from '../../../context/focacciaContext'
import type { FocacciaItem } from '../../../types';
import { AdminItemCard } from '../AdminItemCard/AdminItemCard';
import './_productList.scss'

export const ProductList = () => {
    const { focaccias } = useFocacciaContext();
    const focacciasArray = Array.isArray(focaccias) ? focaccias : [];
    const [open, setOpen] = useState(true);
    return (
        <div className='productListContainer'>
            <div className='header'>
                <h1>Focaccias Existentes</h1>
                <button className='downButton' onClick={() => setOpen(o => !o)}>
                    {open ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>
            <ul
                className={`productListUl${open ? ' open' : ''}`}
            >
                {focacciasArray.map((focaccia: FocacciaItem) => (
                    <AdminItemCard key={focaccia.id} item={focaccia} />
                ))}
            </ul>
        </div>
    )
}
