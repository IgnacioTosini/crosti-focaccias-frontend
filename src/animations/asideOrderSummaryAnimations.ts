import gsap from 'gsap';

export const animateAsideOrderSummaryOpen = (element: HTMLElement, overlay: HTMLElement) => {
    const timeline = gsap.timeline();

    // Animar el overlay (fade in)
    timeline.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    // Animar el panel (slide in desde la derecha)
    timeline.fromTo(element,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' },
        '-=0.2'
    );

    return timeline;
};

export const animateAsideOrderSummaryClose = (element: HTMLElement, overlay: HTMLElement, onComplete: () => void) => {
    const timeline = gsap.timeline({
        onComplete
    });

    // Animar el panel (slide out hacia la derecha)
    timeline.to(element, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in'
    });

    // Animar el overlay (fade out)
    timeline.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
    }, '-=0.1');

    return timeline;
};
