document.addEventListener('DOMContentLoaded', () => {
    const enableBtn = document.querySelector('#enableForm');
    const disableBtn = document.querySelector('#disableForm');
    const slider = document.querySelector('#desperdicio-slider');
    
    async function toggleForm(state) {
        try {
            const response = await fetch(`/toggle_form/${state}`);
            const data = await response.json();
            if (!data.success) {
                console.error('Error toggling form state');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async function updateDesperdicio(valor) {
        try {
            const response = await fetch(`/update_desperdicio/${valor}`);
            const data = await response.json();
            if (!data.success) {
                console.error('Error updating desperdicio');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    if (enableBtn) enableBtn.addEventListener('click', () => toggleForm('enable'));
    if (disableBtn) disableBtn.addEventListener('click', () => toggleForm('disable'));
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            const valor = parseInt(e.target.value);
            updateDesperdicio(valor);
        });
    }
});