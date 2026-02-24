// slidebar.js - Versión Robusta, Delegada a CSS y Blindada
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");

// Función debounce para optimizar el evento resize
function debounce(func, timeout = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

// Función para alternar el menú móvil normal
const toggleMenu = (isActive) => {
  if (menuToggler) {
      menuToggler.querySelector("span").innerText = isActive ? "close" : "menu";
  }
  // Solo bloqueamos el scroll si NO es el menú de la calculadora
  if (sidebar && !sidebar.classList.contains('sidebar-flotante')) {
      document.body.style.overflow = isActive ? 'hidden' : ''; 
  }
};

// Cargar estado inicial desde localStorage (SOLO PARA MENÚ NORMAL)
if (sidebar && !sidebar.classList.contains('sidebar-flotante') && localStorage.getItem('sidebarCollapsed') === 'true') {
  sidebar.classList.add("collapsed");
}

// Evento para colapsar/expandir sidebar (desktop)
if (sidebarToggler) {
  sidebarToggler.addEventListener("click", () => {
    // Ignorar si el clic viene del botón de cerrar de la calculadora
    if (sidebarToggler.id === 'closeSidebarBtn') return;

    if (sidebar && !sidebar.classList.contains('sidebar-flotante')) {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
  });
}

// Evento para menú móvil
if (menuToggler) {
  menuToggler.addEventListener("click", () => {
    if (sidebar && !sidebar.classList.contains('sidebar-flotante')) {
        toggleMenu(sidebar.classList.toggle("menu-active"));
    }
  });
}

// Tooltips con event delegation
const sidebarNav = document.querySelector('.sidebar-nav');
if (sidebarNav) {
  sidebarNav.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.nav-item');
    if (item && sidebar && sidebar.classList.contains('collapsed')) {
      const tooltip = item.querySelector('.nav-tooltip');
      if (tooltip) {
        const rect = item.getBoundingClientRect();
        tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
        tooltip.style.transform = 'translateY(-50%)'; 
        tooltip.style.marginTop = '0'; 
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
      }
    }
  });

  sidebarNav.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.nav-item');
    if (item) {
      const tooltip = item.querySelector('.nav-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
      }
    }
  });
}

// Manejo del resize con debounce
const handleResize = () => {
  // Si no hay sidebar o ES la calculadora flotante, ignorar el resize automático
  if (!sidebar || sidebar.classList.contains('sidebar-flotante')) return;

  sidebar.style.height = '';

  if (window.innerWidth >= 1024) {
    // Modo desktop
    sidebar.classList.remove("menu-active");
    document.body.style.overflow = '';
    if (menuToggler) menuToggler.querySelector("span").innerText = "menu";
  } else {
    // Modo móvil
    sidebar.classList.remove("collapsed");
  }
};

// Inicialización y eventos
window.addEventListener("resize", debounce(handleResize));
document.addEventListener("DOMContentLoaded", handleResize);

// ==========================================
// LÓGICA ESPECÍFICA PARA EL MENÚ FLOTANTE (Calculadora)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const sidebarFlotante = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('menuBackdrop');
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');

  function toggleMenuFlotante() {
      if (sidebarFlotante && backdrop) {
          sidebarFlotante.classList.toggle('active');
          backdrop.classList.toggle('active');
          
          const isOpen = sidebarFlotante.classList.contains('active');
          document.body.style.overflow = isOpen ? 'hidden' : '';
      }
  }

  if (openBtn) openBtn.addEventListener('click', toggleMenuFlotante);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenuFlotante);
  if (backdrop) backdrop.addEventListener('click', toggleMenuFlotante);
});