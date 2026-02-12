document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const container = document.querySelector('.institucion-list');
    const clearButton = document.getElementById('clear-search');

    if (!searchInput || !container || !clearButton) return;

    // Función de búsqueda
    const handleSearch = () => {
        const term = searchInput.value.trim().toLowerCase();
        const instituciones = Array.from(container.querySelectorAll('.institucion'));
        let resultados = 0;

        instituciones.forEach(inst => {
            const nombre = inst.querySelector('h3').textContent.toLowerCase();
            const id = inst.dataset.id?.toLowerCase() || '';
            const matches = nombre.includes(term) || id.includes(term);
            
            inst.style.display = matches ? 'flex' : 'none';
            inst.classList.toggle('search-highlight', matches && term.length > 0);
            
            if (matches) resultados++;
        });

        // Mostrar/ocultar botón clear
        clearButton.style.display = term.length > 0 ? 'block' : 'none';

        // Notificación de resultados
        if (window.mostrarNotificacion && term.length > 1) {
            const mensaje = resultados === 0 ? 'No hay resultados' : `${resultados} ${resultados === 1 ? 'resultado' : 'resultados'}`;
            mostrarNotificacion(mensaje, 'search', 1500);
        }
    };

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        handleSearch();
        
        // Animación
        clearButton.style.transform = 'scale(0.8)';
        setTimeout(() => clearButton.style.transform = '', 200);
    });

    // Tecla Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput.value) {
            searchInput.value = '';
            handleSearch();
        }
    });
});