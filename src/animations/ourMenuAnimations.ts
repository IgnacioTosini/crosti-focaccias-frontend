import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateOurMenu = () => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.ourMenu',
            start: 'top 55%',
            toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' }
    });

    // Animar el título
    timeline.from('.ourMenuTitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // Animar la sección de extra info
    timeline.from('.extraInfo', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.5)'
    }, '-=0.3');

    return timeline;
};
