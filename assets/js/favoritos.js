document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.institucion-list');
  let institucionFavorita = null;

  // Cargar favorito guardado SIN mostrar toast
  const favoritoGuardado = localStorage.getItem('institucionFavorita');
  if (favoritoGuardado) {
      const favorita = document.querySelector(`.institucion[data-id="${favoritoGuardado}"]`);
      if (favorita) {
          // Carga silenciosa con efecto visual sutil
          favorita.classList.add('favorita-loading');
          setTimeout(() => {
              setFavorita(favorita, false); // false = no mostrar toast
              favorita.classList.remove('favorita-loading');
          }, 300);
      }
  }

  // Event Delegation para clics/touch
  container.addEventListener('click', function(e) {
      const star = e.target.closest('.star-icon');
      if (!star) return;
      e.stopPropagation();
      toggleFavorita(star.closest('.institucion'));
  });

  // Manejo táctil optimizado
  let touchStartY;
  container.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', function(e) {
      const star = e.target.closest('.star-icon');
      if (star && Math.abs(e.changedTouches[0].clientY - touchStartY) < 10) {
          e.preventDefault();
          toggleFavorita(star.closest('.institucion'));
      }
  }, { passive: true });

  function toggleFavorita(institucion) {
      if (institucion === institucionFavorita) {
          quitarFavorita();
      } else {
          if (institucionFavorita) quitarFavorita();
          setFavorita(institucion, true); // true = mostrar toast
      }
  }

  function setFavorita(institucion, showToast = true) {
      // Resetear todas las favoritas primero
      document.querySelectorAll('.institucion').forEach(item => {
          item.classList.remove('favorita');
          const star = item.querySelector('.star-icon');
          if (star) star.classList.remove('favorita');
      });

      // Aplicar nueva favorita
      const star = institucion.querySelector('.star-icon');
      star.classList.add('favorita');
      institucion.classList.add('favorita');
      institucionFavorita = institucion;
      localStorage.setItem('institucionFavorita', institucion.dataset.id);
      ordenarInstituciones();
      
      // Mostrar toast solo si es interacción directa
      if (showToast) mostrarFeedback('⭐ ¡Favorita guardada!');
  }

  function quitarFavorita() {
      if (!institucionFavorita) return;
      const star = institucionFavorita.querySelector('.star-icon');
      star.classList.remove('favorita');
      institucionFavorita.classList.remove('favorita');
      localStorage.removeItem('institucionFavorita');
      institucionFavorita = null;
      ordenarAlfabeticamente();
      mostrarFeedback('🌟 Favorito eliminado'); // Siempre mostrar al quitar
  }

  function ordenarInstituciones() {
      const items = Array.from(container.children);
      items.sort((a, b) => {
          if (a === institucionFavorita) return -1;
          if (b === institucionFavorita) return 1;
          return a.querySelector('h3').textContent.localeCompare(
              b.querySelector('h3').textContent
          );
      });
      items.forEach(item => container.appendChild(item));
  }

  function ordenarAlfabeticamente() {
      const items = Array.from(container.children);
      items.sort((a, b) =>
          a.querySelector('h3').textContent.localeCompare(
              b.querySelector('h3').textContent
          )
      );
      items.forEach(item => container.appendChild(item));
  }

  function mostrarFeedback(mensaje) {
      // Eliminar toast existente si hay uno
      const toastExistente = document.querySelector('.feedback-toast');
      if (toastExistente) toastExistente.remove();

      const toast = document.createElement('div');
      toast.className = 'feedback-toast';
      toast.textContent = mensaje;
      document.body.appendChild(toast);
      
      setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
      }, 2700);
  }

  // Eventos para clics en tarjetas (no estrellas)
  document.querySelectorAll('.institucion').forEach(card => {
      card.addEventListener('click', function(e) {
          if (e.target.closest('.star-icon')) return;
          window.location.href = `/institucion/${this.dataset.id}`;
      });
  });
});