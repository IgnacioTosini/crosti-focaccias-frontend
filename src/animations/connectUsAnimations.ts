import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateConnectUs = () => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.connectUs',
            start: 'top 55%',
            toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' },
        delay: 1
    });

    // Animar el título
    timeline.from('.connectUsTitle', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)'
    });

    // Animar las tarjetas de conexión
    timeline.from('.connectCardsContainer > *', {
        y: 100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    }, '-=0.4');

    return timeline;
};
