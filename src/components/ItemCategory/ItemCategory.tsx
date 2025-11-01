import { BiLeaf } from 'react-icons/bi'
import './_itemCategory.scss'

type ItemCategoryProps = {
    focaccia: {
        isVeggie: boolean;
    }
}

export const ItemCategory = ({ focaccia }: ItemCategoryProps) => {
    return (
        <span className='itemCategory'><BiLeaf /> {focaccia.isVeggie ? 'Vegetariano' : ''}</span>
    )
}
