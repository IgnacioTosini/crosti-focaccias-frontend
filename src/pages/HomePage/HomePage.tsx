import { useEffect } from 'react';
import { AboutUs } from '../../components/AboutUs/AboutUs'
import { Banner } from '../../components/Banner/Banner'
import { ConnectUs } from '../../components/ConnectUs/ConnectUs'
import { Header } from '../../components/Header/Header'
import { HowToOrder } from '../../components/HowToOrder/HowToOrder'
import { OurMenu } from '../../components/OurMenu/OurMenu'
import { useFocacciaContext } from '../../context/focacciaContext';
import { AsideOrderSummary } from '../../components/AsideOrderSummary/AsideOrderSummary';
import { usePedidoContext } from '../../context/pedidoContext';
import './_homePage.scss'

export const HomePage = () => {
    const { getFocaccias } = useFocacciaContext();
    const { isOpen } = usePedidoContext();
    useEffect(() => {
        getFocaccias();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Agregar clase para bloquear scroll
            document.documentElement.classList.add('modal-open');
        } else {
            // Remover clase para restaurar scroll
            document.documentElement.classList.remove('modal-open');
        }
        // Cleanup al desmontar
        return () => {
            document.documentElement.classList.remove('modal-open');
        };
    }, [isOpen]);

    return (
        <main className="homePage">
            <Header />
            <Banner />
            <section id="sobre-nosotros">
                <AboutUs />
            </section>
            <section id="menu">
                <OurMenu />
            </section>
            <section id="como-ordenar">
                <HowToOrder />
            </section>
            <section id="contacto">
                <ConnectUs />
            </section>

            {isOpen && <AsideOrderSummary />}
        </main>
    )
}
