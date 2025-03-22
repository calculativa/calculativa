document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    const darkModeLabel = document.getElementById('dark-mode-label');
    let currentMode = localStorage.getItem('darkMode') || 'system';

    function updateMode(mode) {
        document.body.classList.remove('light-mode', 'dark-mode', 'system-mode');
        document.body.classList.add(`${mode}-mode`);
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
            darkModeIcon.textContent = 'computer'; // Cambia a "computer"
            darkModeLabel.textContent = 'Sistema';
        }
    }

    updateMode(currentMode);

    darkModeToggle.addEventListener('click', function() {
        if (currentMode === 'light') {
            updateMode('dark');
        } else if (currentMode === 'dark') {
            updateMode('system');
        } else {
            updateMode('light');
        }
    });
});