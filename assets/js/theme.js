document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    let savedTheme = localStorage.getItem("theme") || "system";

    // Función para aplicar el tema del sistema
    function applySystemTheme() {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark-mode", prefersDark);
        document.documentElement.classList.toggle("light-mode", !prefersDark);
    }

    // Función para aplicar el tema seleccionado
    function applyTheme(theme) {
        document.documentElement.classList.remove("light-mode", "dark-mode");

        if (theme === "dark") {
            document.documentElement.classList.add("dark-mode");
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Cambiar a tema claro");
        } else if (theme === "light") {
            document.documentElement.classList.add("light-mode");
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute("aria-label", "Cambiar a tema sistema");
        } else {
            themeToggle.textContent = "🖥️";
            themeToggle.setAttribute("aria-label", "Cambiar a tema oscuro");
            applySystemTheme(); // Aplicar el tema del sistema
        }
        
        localStorage.setItem("theme", theme);
    }

    // Aplicar el tema guardado al cargar la página
    applyTheme(savedTheme);

    // Detectar cambios en el sistema y actualizar en tiempo real
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (localStorage.getItem("theme") === "system") {
            applyTheme("system");
        }
    });

    // Cambiar tema al hacer clic en el botón
    themeToggle.addEventListener("click", () => {
        const themes = ["dark", "light", "system"];
        const currentIndex = themes.indexOf(savedTheme);
        const newTheme = themes[(currentIndex + 1) % themes.length]; // Ciclar entre temas
        
        savedTheme = newTheme; // Guardar el nuevo estado
        applyTheme(newTheme);
    });
});