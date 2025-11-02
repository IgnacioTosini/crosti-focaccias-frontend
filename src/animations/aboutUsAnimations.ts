import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateAboutUs = () => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.aboutUsContainer',
            start: 'top 55%',
            toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' }
    });

    // Animar el título
    timeline.from('.aboutUsTitle', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // Animar los párrafos de texto uno por uno
    timeline.from('.textContainer .aboutUsText', {
        x: -100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.4');

    // Animar la imagen desde la derecha
    timeline.from('.imageContainer img', {
        x: 100,
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(1.5)'
    }, '-=0.6');

    // Animar el texto debajo de la imagen
    timeline.from('.imageContainer .aboutUsText', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    return timeline;
};
