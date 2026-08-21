/* ==========================================================================
   CARLOS GLETISON - INTERACTIVE LOGIC & PARTICLE CANVAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initShareAndCopy();
});

/* ==========================================================================
   1. AMBIENT PARTICLES CANVAS
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 25 : 45;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.15;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.isBlue = Math.random() > 0.4;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > 0.7) this.alpha = 0.7;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isBlue 
                ? `rgba(0, 210, 255, ${this.alpha})`
                : `rgba(0, 102, 255, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 102, 255, 0.5)';
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    function connectParticles() {
        const maxDistance = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 150, 255, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. SHARE BUTTON & COPY ACTIONS
   ========================================================================== */
function initShareAndCopy() {
    const shareBtn = document.getElementById('share-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');

    // Share Button
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Carlos Gletison | Web Designer & Editor de Vídeo',
                text: 'Confira os links de contato e projetos de Carlos Gletison (@carlos_n0110)',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    // Fallback to copy if user cancels or fails
                    copyToClipboard(window.location.href, 'Link do perfil copiado! 🎉');
                }
            } else {
                copyToClipboard(window.location.href, 'Link do perfil copiado! 🎉');
            }
        });
    }

    // Copy Email Button
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'carlos.design.video@gmail.com';
            copyToClipboard(email, 'E-mail copiado para a área de transferência! ✉️');
        });
    }
}

/* Helper to copy text and show custom Toast */
function copyToClipboard(text, message) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(() => {
            fallbackCopyTextToClipboard(text, message);
        });
    } else {
        fallbackCopyTextToClipboard(text, message);
    }
}

function fallbackCopyTextToClipboard(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(message);
    } catch (err) {
        showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}
