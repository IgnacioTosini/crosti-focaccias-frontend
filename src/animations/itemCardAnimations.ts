import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateItemCard = (element: HTMLElement, index: number = 0) => {
    // Establecer estado inicial visible
    gsap.set(element, { opacity: 1, y: 0, scale: 1 });
    
    return gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 60%', // Mismo nivel que HowToOrder y ConnectUs
            toggleActions: 'play none none none',
            once: true
        },
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: index * 0.1, // Stagger entre cards
        ease: 'back.out(1.7)'
    });
};
