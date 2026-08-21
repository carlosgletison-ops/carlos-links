/* ==========================================================================
   CARLOS GLETISON - MINIMAL SHARE & TOAST INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('share-btn');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Carlos Gletison • Links',
                text: 'Web Designer & Editor de Vídeo',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    copyLink();
                }
            } else {
                copyLink();
            }
        });
    }
});

function copyLink() {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copiado!');
        }).catch(() => {
            fallbackCopy(window.location.href);
        });
    } else {
        fallbackCopy(window.location.href);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('Link copiado!');
    } catch (e) {
        showToast('Não foi possível copiar');
    }
    document.body.removeChild(textarea);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
