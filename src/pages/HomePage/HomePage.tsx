import { useEffect } from 'react';
import { AboutUs } from '../../components/AboutUs/AboutUs'
import { Banner } from '../../components/Banner/Banner'
import { ConnectUs } from '../../components/ConnectUs/ConnectUs'
import { Header } from '../../components/Header/Header'
import { HowToOrder } from '../../components/HowToOrder/HowToOrder'
import { OurMenu } from '../../components/OurMenu/OurMenu'
import { AsideOrderSummary } from '../../components/AsideOrderSummary/AsideOrderSummary';
import { Chatbot } from '../../components/Chatbot/Chatbot';
import { usePedidoContext } from '../../context/pedidoContext';
import { usePrefetchFocaccias } from '../../hooks/usePrefetchFocaccias';
import './_homePage.scss'

export const HomePage = () => {
    const { isOpen } = usePedidoContext();

    // Precargar datos de focaccias de manera eficiente
    usePrefetchFocaccias();

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
            <Chatbot />
        </main>
    )
}
