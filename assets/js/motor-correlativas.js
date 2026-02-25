const rightBtn = document.querySelector("#scrolling-button-right");
const leftBtn = document.querySelector("#scrolling-button-left");
const content = document.querySelector(".caja-cursado");

if (rightBtn && leftBtn && content) {
    const scrollAmount = document.querySelector(".caja-materias").clientWidth;

    // Desplazar hacia la derecha
    rightBtn.addEventListener("click", () => {
        content.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Desplazar hacia la izquierda
    leftBtn.addEventListener("click", () => {
        content.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Actualizar el estado visual y funcional de los botones
    function updateButtons() {
        // ¿Estamos al principio de todo? (Izquierda)
        if (content.scrollLeft <= 1) { // Usamos 1 en vez de 0 por redondeos de pantalla
            leftBtn.style.opacity = "0.3";          // Lo hace semi-transparente
            leftBtn.style.pointerEvents = "none";   // Bloquea los clics
        } else {
            leftBtn.style.opacity = "1";            // Color normal
            leftBtn.style.pointerEvents = "auto";   // Permite clics
        }

        // ¿Llegamos al final del carrusel? (Derecha)
        const maxScroll = content.scrollWidth - content.clientWidth;
        if (content.scrollLeft >= maxScroll - 1) {
            rightBtn.style.opacity = "0.3";
            rightBtn.style.pointerEvents = "none";
        } else {
            rightBtn.style.opacity = "1";
            rightBtn.style.pointerEvents = "auto";
        }
    }

    // Actualizar botones al cargar la página y al desplazarse
    content.addEventListener("scroll", updateButtons);
    updateButtons(); // Llamar al cargar la página
} else {
    console.error("No se encontraron los elementos necesarios para el desplazamiento horizontal.");
    // Opcional: Mostrar un mensaje al usuario
    alert("Error: No se pudo inicializar el desplazamiento horizontal.");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.checkbox-materia').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                let group = this.getAttribute('data-group');
                document.querySelectorAll(`.checkbox-materia[data-group="${group}"]`).forEach(other => {
                    if (other !== this) {
                        other.checked = false;
                    }
                });
            }
        });
    });
});

//Desactivar chechbox al apretar 1

document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los contenedores de materias y cajas cambiador
    const contenedores = document.querySelectorAll('.materia-contenedor, .caja-cambiador');

    // Recorrer cada contenedor
    contenedores.forEach(contenedor => {
        // Seleccionar los checkboxes dentro del contenedor actual
        const checkboxes = contenedor.querySelectorAll('.checkbox-materia');

        // Añadir un event listener a cada checkbox
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    // Desmarcar los otros checkboxes en el mismo contenedor
                    checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
            });
        });
    });
});

// ==========================================
// 3. LÓGICA DEL PANEL LATERAL Y MODAL DE INFO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const botonesMaterias = document.querySelectorAll('.materia-btn');
    const panelTitulo = document.getElementById('materia-nombre');
    const panelCondicion1 = document.getElementById('condicion-1');
    const panelCondicion2 = document.getElementById('condicion-2');
    const panelCondicion3 = document.getElementById('condicion-3');
    
    // Elementos del Modal y Botón Flotante
    const btnMasInfo = document.getElementById('btn-mas-info');
    const modalOverlay = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const btnCerrarModal = document.getElementById('modal-cerrar');

    let botonActivo = null;

    // Aseguramos que el modal inicie oculto
    if(modalOverlay) modalOverlay.classList.add('modal-oculto');
    if(btnMasInfo) btnMasInfo.classList.add('oculto');

    // Lógica para cerrar el Modal
    if (btnCerrarModal && modalOverlay) {
        btnCerrarModal.addEventListener('click', () => modalOverlay.classList.add('modal-oculto'));
        // Cerrar si tocan afuera de la caja blanca
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) modalOverlay.classList.add('modal-oculto');
        });
    }

    function resaltarPalabras(texto) {
        if (!texto) return "";
        return texto
            .replace(/Regular/gi, '<span class="texto-regular">REGULAR</span>')
            .replace(/Regulares/gi, '<span class="texto-regular">REGULARES</span>')
            .replace(/Aprobada/gi, '<span class="texto-aprobado">APROBADA</span>')
            .replace(/Aprobadas/gi, '<span class="texto-aprobado">APROBADAS</span>');
    }

    if (botonesMaterias.length > 0 && panelTitulo) {
        botonesMaterias.forEach(boton => {
            boton.addEventListener('click', () => {
                
                // CASO A: Apagar el botón
                if (botonActivo === boton) {
                    panelTitulo.textContent = "Selecciona una materia";
                    panelCondicion1.innerHTML = "Aquí verás los requisitos para poder cursarla o rendirla.";
                    panelCondicion2.innerHTML = "";
                    if(panelCondicion3) panelCondicion3.innerHTML = ""; 
                    
                    if(btnMasInfo) btnMasInfo.classList.add('oculto'); // Ocultar botón flotante
                    
                    boton.style.color = "var(--text-color)";
                    botonActivo = null;
                } 
                // CASO B: Encender un botón
                else {
                    botonesMaterias.forEach(b => b.style.color = "var(--text-color)");
                    
                    const nombre = boton.getAttribute('data-nombre');
                    const reqCursarReg = boton.getAttribute('data-cursar-reg');
                    const reqCursarAprob = boton.getAttribute('data-cursar-aprob');
                    const reqRendir = boton.getAttribute('data-rendir');
                    const detallesExtensos = boton.getAttribute('data-detalles'); // Capturamos la info larga

                    panelTitulo.textContent = nombre || boton.textContent;
                    panelCondicion1.innerHTML = resaltarPalabras(reqCursarReg) || "";
                    panelCondicion2.innerHTML = resaltarPalabras(reqCursarAprob) || "";
                    if(panelCondicion3) panelCondicion3.innerHTML = resaltarPalabras(reqRendir) || "";
                    
                    boton.style.color = "var(--primary-color)";
                    botonActivo = boton;

                    // Mostrar el botón flotante SOLO si la materia tiene detalles extra
                    if(btnMasInfo && detallesExtensos) {
                        btnMasInfo.classList.remove('oculto');
                        
                        // Configurar el click del botón flotante para que abra ESTE texto
                        btnMasInfo.onclick = () => {
                            modalTitulo.textContent = "Detalles: " + (nombre || boton.textContent);
                            modalTexto.innerHTML = resaltarPalabras(detallesExtensos); // También pintamos palabras aquí
                            modalOverlay.classList.remove('modal-oculto');
                        };
                    } else if (btnMasInfo) {
                        btnMasInfo.classList.add('oculto');
                    }
                }
            });
        });
    }
});