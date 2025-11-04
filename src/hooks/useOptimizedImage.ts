import { useState, useEffect, useRef } from 'react';

interface UseOptimizedImageProps {
    src: string;
    alt: string;
    threshold?: number;
    rootMargin?: string;
}

interface UseOptimizedImageReturn {
    imgRef: React.RefObject<HTMLImageElement | null>;
    isLoaded: boolean;
    hasError: boolean;
    isInView: boolean;
    shouldShowSkeleton: boolean;
}

export const useOptimizedImage = ({
    src,
    threshold = 0.1,
    rootMargin = '100px'
}: UseOptimizedImageProps): UseOptimizedImageReturn => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer para detectar cuándo la imagen entra en viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    // Precargar imagen inmediatamente si tenemos src y está en viewport
    useEffect(() => {
        if (src && !isLoaded && !hasError) {
            // Si está en viewport o si no hemos inicializado el observer aún, cargar inmediatamente
            const shouldLoad = isInView || !imgRef.current;

            if (shouldLoad) {
                const img = new Image();

                img.onload = () => {
                    setIsLoaded(true);
                };

                img.onerror = () => {
                    setHasError(true);
                };

                img.src = src;
            }
        }
    }, [src, isInView, isLoaded, hasError]);

    // Efecto adicional para cargar imágenes visibles inmediatamente
    useEffect(() => {
        if (src && imgRef.current) {
            // Verificar si el elemento ya está visible al montarse
            const rect = imgRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible && !isInView) {
                setIsInView(true);
            }
        }
    }, [src, isInView]);

    const shouldShowSkeleton = isInView && !isLoaded && !hasError;

    return {
        imgRef,
        isLoaded,
        hasError,
        isInView,
        shouldShowSkeleton
    };
};