import { useEffect } from 'react';
import {  useFocacciaContext } from '../../context/focacciaContext';
import { AdminHeader } from '../../components/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '../../components/Admin/AdminForm/AdminForm';
import { ProductList } from '../../components/Admin/ProductList/ProductList';
import { PedidosList } from '../../components/Admin/PedidosList/PedidosList';
import { usePedidoContext } from '../../context/pedidoContext';
import './_abmPage.scss'

export const AbmPage = () => {
  const { isOpen, getFocaccias } = useFocacciaContext();
  const { getPedidos } = usePedidoContext();
  useEffect(() => {
    getFocaccias();
    getPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className='abmPage'>
      <AdminHeader />
      {isOpen && <AdminForm />}
      <div className="abmPageContent">
        <ProductList />
        <PedidosList />
      </div>
    </main>
  )
}
