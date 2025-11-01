import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFocacciaContext } from '../../../context/focacciaContext';
import './_adminHeader.scss';

export const AdminHeader = () => {
  const { setIsOpen, isOpen, setFocacciaEdit } = useFocacciaContext();
  const navigate = useNavigate();

  const handleNewFocaccia = () => {
    setFocacciaEdit(null);
    setIsOpen(!isOpen);
  };

  return (
    <header className="adminHeader">
      <button className="adminHeaderButton" onClick={() => navigate('/?apiKey=focacciaCrostiSecret')}>Volver al sitio</button>
      <h1 className='adminHeaderTitle'>Panel de Administración - Focaccias</h1>
      <button className='adminHeaderButton' onClick={handleNewFocaccia}><FaPlus /><span>Nueva Focaccia</span></button>
    </header>
  )
}
