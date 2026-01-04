// slidebar.js - Versión mejorada
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");

// Configuración de alturas (deben coincidir con el CSS)
const collapsedSidebarHeight = "56px"; // Altura en móvil
const fullSidebarHeight = "calc(100vh - 32px)"; // Altura en desktop

// Función debounce para optimizar el evento resize
function debounce(func, timeout = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

// Función para alternar el menú móvil
const toggleMenu = (isActive) => {
  sidebar.style.height = isActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
  menuToggler.querySelector("span").innerText = isActive ? "close" : "menu";
  document.body.style.overflow = isActive ? 'hidden' : ''; // Bloquear scroll cuando el menú está abierto
};

// Cargar estado inicial desde localStorage
if (localStorage.getItem('sidebarCollapsed') === 'true') {
  sidebar.classList.add("collapsed");
}

// Evento para colapsar/expandir sidebar (desktop)
sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
});

// Evento para menú móvil
menuToggler.addEventListener("click", () => {
  toggleMenu(sidebar.classList.toggle("menu-active"));
});

// Tooltips con event delegation (mejor rendimiento)
document.querySelector('.sidebar-nav').addEventListener('mouseover', (e) => {
  const item = e.target.closest('.nav-item');
  if (item && sidebar.classList.contains('collapsed')) {
    const tooltip = item.querySelector('.nav-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
    }
  }
});

document.querySelector('.sidebar-nav').addEventListener('mouseout', (e) => {
  const item = e.target.closest('.nav-item');
  if (item) {
    const tooltip = item.querySelector('.nav-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
    }
  }
});

// Manejo del resize con debounce
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    // Modo desktop
    sidebar.style.height = fullSidebarHeight;
    sidebar.classList.remove("menu-active");
    document.body.style.overflow = '';
    menuToggler.querySelector("span").innerText = "menu";
  } else {
    // Modo móvil
    sidebar.classList.remove("collapsed");
    sidebar.style.height = sidebar.classList.contains("menu-active") 
      ? `${sidebar.scrollHeight}px` 
      : collapsedSidebarHeight;
  }
};

// Inicialización y eventos
window.addEventListener("resize", debounce(handleResize));
document.addEventListener("DOMContentLoaded", handleResize); // Inicializar al cargar