import { FaEdit, FaTrash } from 'react-icons/fa';
import type { FocacciaItem } from '../../../types';
import { ItemCategory } from '../../ItemCategory/ItemCategory';
import { useFocacciaContext } from '../../../context/focacciaContext';
import { ImageService } from '../../../services/ImageService';
import { toast } from 'react-toastify';
import './_adminItemCard.scss'

type AdminItemCardProps = {
  item: FocacciaItem;
}

export const AdminItemCard = ({ item }: AdminItemCardProps) => {
  const { setFocacciaEdit, setIsOpen, deleteFocaccia } = useFocacciaContext();
  const handleDelete = async () => {
    if (window.confirm('¿Seguro que deseas eliminar esta focaccia?')) {
      // Si tiene imagen en Cloudinary, primero la borra
      if (item.imagePublicId) {
        try {
          await ImageService.deleteImage(item.imagePublicId);
        } catch (e) {
          console.error('Error deleting image from Cloudinary', e);
          toast.warn('No se pudo borrar la imagen de Cloudinary');
        }
      }
      await deleteFocaccia(item.id);
    }
  };

  const handleEdit = () => {
    setFocacciaEdit(item);
    setIsOpen(true);
    
    // Scroll suave hacia el principio de la página
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100); // Pequeño delay para que el modal se abra primero
  };

  return (
    <div className='adminItemCard'>
      <div className='adminItemCardContent'>
        <div className='adminItemCardHeader'>
          <h2 className='adminItemName'>{item.name}</h2>
          <ItemCategory focaccia={item} />
        </div>
        <p className='adminItemDescription'>{item.description}</p>
        <span className='adminItemPrice'>$ {item.price}</span>
        <img src={item.imageUrl} alt={item.name} className='adminItemImage' />
      </div>
      <div className='adminItemCardActions'>
  <button className='adminItemCardEditButton' onClick={handleEdit}><FaEdit /></button>
  <button className='adminItemCardDeleteButton' onClick={handleDelete}><FaTrash /></button>
      </div>
    </div>
  )
}
