document.addEventListener('DOMContentLoaded', () => {
    const eventSource = new EventSource('/stream');
    
    // Elementos del panel de test
    const formStatus = document.getElementById('formStatus');
    const sliderValue = document.getElementById('sliderValue');
    const slider = document.getElementById('desperdicio-slider');

    // Elementos de la página principal
    const submitButton = document.querySelector('button[type="submit"]');
    const desperdicioValue = document.getElementById('desperdicio-value');
    const sliderVisualizador =  document.getElementById('sliderVisualizador');

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        // Actualizar panel de test si estamos en esa página
        if (formStatus) {
            formStatus.textContent = data.form_enabled ? 'Habilitado' : 'Deshabilitado';
        }
        
        if (sliderValue) {
            sliderValue.textContent = `${data.desperdicio}%`;
            if (slider && slider.value != data.desperdicio) {
                slider.value = data.desperdicio;
            }
        }
        
        // Actualizar solo el botón de envío
        if (submitButton) {
            if (data.form_enabled) {
                submitButton.removeAttribute('disabled');
            } else {
                submitButton.setAttribute('disabled', 'disabled');
            }
        }

        // Actualizar el valor del desperdicio
        if (desperdicioValue) {
            desperdicioValue.textContent = data.desperdicio;
        }

        // Actualizar el valor del visualizador
        if (desperdicioValue) {
            sliderVisualizador.value = data.desperdicio;
        }
    };

    eventSource.onerror = function(error) {
        console.error('Error en la conexión SSE:', error);
        eventSource.close();
    };
});