/* ==========================================================================
   CARLOS GLETISON — INTRO ANIMATION & PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initIntroAnimation();
});

function initIntroAnimation() {
    const introScreen = document.getElementById('intro-screen');
    if (!introScreen) return;

    // After circle expansion animation completes (1.4s), hide and remove preloader
    setTimeout(() => {
        introScreen.classList.add('done');
    }, 1400);

    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1800);
}
