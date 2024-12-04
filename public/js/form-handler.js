// public/js/form-handler.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/form-status');
                const data = await response.json();
                
                if (data.enabled) {
                    form.submit();
                } else {
                    alert('El formulario está deshabilitado');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

// public/js/test-panel.js
document.addEventListener('DOMContentLoaded', () => {
    const enableBtn = document.querySelector('#enableForm');
    const disableBtn = document.querySelector('#disableForm');
    const statusElement = document.querySelector('#formStatus');
    const sliderValue = document.querySelector('#sliderValue');
    
    async function updateStatus() {
        try {
            const response = await fetch('/api/form-status');
            const data = await response.json();
            statusElement.textContent = data.enabled ? 'Habilitado' : 'Deshabilitado';
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    enableBtn?.addEventListener('click', async () => {
        await fetch('/api/enable-form', { method: 'POST' });
        updateStatus();
    });
    
    disableBtn?.addEventListener('click', async () => {
        await fetch('/api/disable-form', { method: 'POST' });
        updateStatus();
    });
    
    // Actualizar estado inicial
    updateStatus();
});

// public/js/gallery-redirect.js
if (window.location.pathname === '/gallery') {
    setTimeout(() => {
        window.location.href = '/thanks';
    }, 20000);
}

// public/js/thanks-redirect.js
if (window.location.pathname === '/thanks') {
    setTimeout(() => {
        window.location.href = '/';
    }, 20000);
}