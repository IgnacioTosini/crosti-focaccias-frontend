import gsap from 'gsap';

export const animateBanner = () => {
    const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    // Animar la imagen con escala y rotación
    timeline.from('.bannerImage', {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.7)'
    });

    // Animar el título línea por línea
    timeline.from('.bannerTitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6');

    timeline.from('.bannerTitle span', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)'
    }, '-=0.3');

    // Animar el subtítulo
    timeline.from('.bannerSubtitle', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4');

    return timeline;
};
