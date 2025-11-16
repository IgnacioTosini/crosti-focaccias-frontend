import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://crosti-focaccias-frontend.vercel.app';

export const CanonicalUrl = () => {
    const location = useLocation();

    useEffect(() => {
        // Construir URL canónica incluyendo query params
        const canonicalUrl = `${BASE_URL}${location.pathname}${location.search}`;

        // Buscar si ya existe un link canonical
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

        if (canonicalLink) {
            // Si existe, actualizar su href
            canonicalLink.href = canonicalUrl;
        } else {
            // Si no existe, crearlo
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            canonicalLink.href = canonicalUrl;
            document.head.appendChild(canonicalLink);
        }

        // También actualizar meta tags de Open Graph y Twitter
        const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
        if (ogUrl) {
            ogUrl.content = canonicalUrl;
        }

        const twitterUrl = document.querySelector('meta[property="twitter:url"]') as HTMLMetaElement;
        if (twitterUrl) {
            twitterUrl.content = canonicalUrl;
        }
    }, [location]);

    return null; // Este componente no renderiza nada
};
