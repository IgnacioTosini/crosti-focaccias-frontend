import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateItemCard = (element: HTMLElement) => {
    // Establecer estado inicial visible
    gsap.set(element, { opacity: 1, y: 0, scale: 1 });
    
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 55%',
            toggleActions: 'play none none none',
            once: true
        },
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.7)'
    });
};
