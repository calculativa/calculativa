document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    const darkModeLabel = document.getElementById('dark-mode-label');
    let currentMode = localStorage.getItem('darkMode') || 'system';

    // Función para detectar el modo del sistema
    function getSystemMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Función para aplicar el modo
    function applyMode(mode) {
        // Elimina todas las clases de modo
        document.body.classList.remove('light-mode', 'dark-mode', 'system-mode');

        // Aplica el modo correspondiente
        if (mode === 'system') {
            const systemMode = getSystemMode();
            document.body.classList.add(`${systemMode}-mode`);
        } else {
            document.body.classList.add(`${mode}-mode`);
        }

        // Guarda el modo en localStorage
        localStorage.setItem('darkMode', mode);
        currentMode = mode;

        // Actualiza el icono y la etiqueta
        if (mode === 'light') {
            darkModeIcon.textContent = 'light_mode';
            darkModeLabel.textContent = 'Claro';
        } else if (mode === 'dark') {
            darkModeIcon.textContent = 'dark_mode';
            darkModeLabel.textContent = 'Oscuro';
        } else {
            darkModeIcon.textContent = 'computer';
            darkModeLabel.textContent = 'Sistema';
        }
    }

    // Aplica el modo guardado o el modo del sistema al cargar la página
    applyMode(currentMode);

    // Escucha el evento de cambio en el modo del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (currentMode === 'system') {
            applyMode('system');
        }
    });

    // Cambia entre modos al hacer clic en el botón
    darkModeToggle.addEventListener('click', function () {
        if (currentMode === 'light') {
            applyMode('dark');
        } else if (currentMode === 'dark') {
            applyMode('system');
        } else {
            applyMode('light');
        }
    });
});

// ==========================================
// CONTROL DE PANTALLA COMPLETA (FULLSCREEN)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const iconoFullscreen = document.getElementById('icono-fullscreen');
    const textoFullscreen = document.getElementById('texto-fullscreen');

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace "#" te suba al inicio de la página

            if (!document.fullscreenElement) {
                // Si NO estamos en pantalla completa, entramos
                document.documentElement.requestFullscreen().catch((err) => {
                    console.log(`Error al intentar iniciar pantalla completa: ${err.message}`);
                });
            } else {
                // Si YA estamos en pantalla completa, salimos
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });

        // Escuchamos si la pantalla cambia (incluso si el usuario sale apretando la tecla ESC en PC)
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                // Estamos en pantalla completa
                iconoFullscreen.textContent = 'fullscreen_exit';
                textoFullscreen.textContent = 'Minimizar Pantalla';
            } else {
                // Volvimos a la normalidad
                iconoFullscreen.textContent = 'fullscreen';
                textoFullscreen.textContent = 'Pantalla Completa';
            }
        });
    }
});