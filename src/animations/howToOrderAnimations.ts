import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHowToOrder = () => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.howToOrder',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' },
    });

    // Animar el título
    timeline.from('.howToOrderTitle', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // Animar los pasos uno por uno
    timeline.from('.howToOrderSteps .step', {
        x: (index) => index === 0 ? -100 : 100, // Primer paso desde izquierda, segundo desde derecha
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power2.out'
    }, '-=0.4');

    return timeline;
};
