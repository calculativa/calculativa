// notification.js
class Notificador {
    constructor() {
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }

    mostrar(mensaje, icono = 'info', duracion = 3000) {
        // Evitar duplicados
        const notificaciones = Array.from(this.container.children);
        if (notificaciones.some(n => n.textContent.includes(mensaje))) return;

        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.innerHTML = `
            <span class="material-symbols-rounded">${icono}</span>
            <span class="notification-text">${mensaje}</span>
        `;

        this.container.prepend(notificacion);

        // Animación de entrada
        setTimeout(() => notificacion.classList.add('show'), 10);

        // Auto-eliminación
        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 300);
        }, duracion);
    }
}

// Instancia global (opcional)
const notificador = new Notificador();

// Función global para uso rápido
function mostrarNotificacion(mensaje, icono = 'info', duracion = 3000) {
    notificador.mostrar(mensaje, icono, duracion);
}