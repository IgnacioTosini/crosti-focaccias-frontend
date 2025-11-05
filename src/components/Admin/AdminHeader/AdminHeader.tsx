import { FaPlus } from 'react-icons/fa';
import { useFocacciaContext } from '../../../context/focacciaContext';
import './_adminHeader.scss';

export const AdminHeader = () => {
  const { setIsOpen, isOpen, setFocacciaEdit } = useFocacciaContext();

  const handleNewFocaccia = () => {
    setFocacciaEdit(null);
    setIsOpen(!isOpen);
  };

  const handleBackToSite = () => {
    // Solución simple: navegar directamente y recargar
    window.location.href = '/?apiKey=focacciaCrostiSecret';
  };

  return (
    <header className="adminHeader">
      <button className="adminHeaderButton" onClick={handleBackToSite}>Volver al sitio</button>
      <h1 className='adminHeaderTitle'>Panel de Administración - Focaccias</h1>
      <button className='adminHeaderButton' onClick={handleNewFocaccia}><FaPlus /><span>Nueva Focaccia</span></button>
    </header>
  )
}