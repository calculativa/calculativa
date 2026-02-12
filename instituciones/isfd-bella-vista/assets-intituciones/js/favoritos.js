document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.institucion-list');
    let lastTapTime = 0;
    const TAP_DELAY = 300; // ms para prevenir doble toque
    const SCROLL_THRESHOLD = 10; // Píxeles de movimiento para considerar scroll
    
    // Variables para control de scroll táctil
    let touchStartX = 0;
    let touchStartY = 0;
    let currentFavorite = null;

    // 1. Primero ordenar alfabéticamente
    ordenarAlfabeticamente();

    // 2. Luego cargar favorito guardado si existe
    const favoritoGuardado = localStorage.getItem('institucionFavorita');
    if (favoritoGuardado) {
        currentFavorite = document.querySelector(`.institucion[data-id="${favoritoGuardado}"]`);
        if (currentFavorite) {
            setFavorita(currentFavorite, false); // Carga silenciosa
        }
    }

    // Event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('click', handleFavoriteAction);

    // Manejar clics en las tarjetas (no estrellas)
    document.querySelectorAll('.institucion').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.star-icon')) return;
            window.location.href = `/institucion/${this.dataset.id}`;
        });
    });

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        const star = e.target.closest('.star-icon');
        if (!star) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        
        // Prevenir doble toque rápido
        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime < TAP_DELAY) return;
        lastTapTime = currentTime;
        
        // Si el movimiento fue mayor al umbral, es un scroll
        if (deltaX > SCROLL_THRESHOLD || deltaY > SCROLL_THRESHOLD) {
            return; // Ignorar si fue scroll
        }
        
        e.preventDefault();
        processFavoriteAction(star);
    }

    function handleFavoriteAction(e) {
        const star = e.target.closest('.star-icon');
        if (!star) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Prevenir doble clic rápido
        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime < TAP_DELAY) return;
        lastTapTime = currentTime;
        
        processFavoriteAction(star);
    }

    function processFavoriteAction(star) {
        // Feedback visual inmediato
        star.style.transform = 'scale(1.2)';
        setTimeout(() => star.style.transform = '', 150);
        
        const institucion = star.closest('.institucion');
        
        if (institucion === currentFavorite) {
            quitarFavorita(institucion);
        } else {
            setFavorita(institucion, true);
        }
    }

    function setFavorita(institucion, showToast = true) {
        // Remover favorito actual si existe
        if (currentFavorite) {
            currentFavorite.classList.remove('favorita');
            const star = currentFavorite.querySelector('.star-icon');
            if (star) star.classList.remove('favorita');
        }

        // Establecer nuevo favorito
        const star = institucion.querySelector('.star-icon');
        star.classList.add('favorita');
        institucion.classList.add('favorita');
        currentFavorite = institucion;
        localStorage.setItem('institucionFavorita', institucion.dataset.id);
        ordenarInstituciones();
        
        // Notificación de favorito añadido
        if (showToast) {
            const nombre = institucion.querySelector('h3').textContent;
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion(`⭐ ${nombre} añadido a favoritos`, 'star');
            } else {
                console.log('Función mostrarNotificacion no está disponible');
                // Opcional: Mostrar un toast alternativo si es necesario
            }
        }
    }

    function quitarFavorita(institucion) {
        const star = institucion.querySelector('.star-icon');
        star.classList.remove('favorita');
        institucion.classList.remove('favorita');
        currentFavorite = null;
        localStorage.removeItem('institucionFavorita');
        ordenarAlfabeticamente();
        
        // Notificación de favorito eliminado
        const nombre = institucion.querySelector('h3').textContent;
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`❌ ${nombre} removido de favoritos`, 'close');
        } else {
            console.log('Función mostrarNotificacion no está disponible');
        }
    }

    function ordenarInstituciones() {
        if (!currentFavorite) {
            ordenarAlfabeticamente();
            return;
        }

        const items = Array.from(container.children);
        
        items.sort((a, b) => {
            if (a === currentFavorite) return -1;
            if (b === currentFavorite) return 1;
            return getInstitucionName(a).localeCompare(getInstitucionName(b));
        });
        
        reordenarItems(items);
    }
    
    function ordenarAlfabeticamente() {
        const items = Array.from(container.children);
        items.sort((a, b) => getInstitucionName(a).localeCompare(getInstitucionName(b)));
        reordenarItems(items);
    }
    
    function getInstitucionName(item) {
        return item.querySelector('h3').textContent.toLowerCase();
    }
    
    function reordenarItems(items) {
        // Usamos DocumentFragment para mejor rendimiento
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(item));
        container.innerHTML = ''; // Limpiar contenedor
        container.appendChild(fragment); // Agregar items ordenados
    }
});