import gsap from 'gsap';

export const animateHeader = () => {
    const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    // Animar el logo desde arriba con rebote
    timeline.from('.logoContainer', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'bounce.out'
    });

    // Animar los items del menú uno por uno desde la derecha
    timeline.from('.navLinks ul li', {
        x: 100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15, // Delay entre cada elemento
        ease: 'back.out(1.7)'
    }, '-=0.5'); // Empieza 0.5s antes de que termine la animación anterior

    // Animar los botones con efecto de escala
    timeline.from('.buttonsContainer button', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(2)'
    }, '-=0.3');

    return timeline;
};
