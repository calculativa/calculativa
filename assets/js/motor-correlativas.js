// ==========================================
// 1. INICIO
// ==========================================

// Función que agrupa los números y crea el HTML con la "llave"
function armarListaAgrupada(reqs) {
    if (!reqs) return `   ✅ Ninguna materia previa.\n`;
    
    // -- PALABRAS MÁGICAS RESERVADAS --
    if (reqs === "TODAS") return `   🌟 TODAS las demás materias de la carrera.\n`;
    if (reqs === "TODAS1") return `   🌟 TODAS las materias de 1° Año.\n`;
    if (reqs === "TODAS2") return `   🌟 TODAS las materias de 2° Año.\n`;
    if (reqs === "TODAS3") return `   🌟 TODAS las materias de 3° Año.\n`;
    
    // 1. Agrupamos los IDs en cajas por año
    let grupos = {};
    reqs.split(',').forEach(id => {
        let idLimpio = id.trim();
        let anio = obtenerAnio(idLimpio);
        if (!grupos[anio]) grupos[anio] = [];
        grupos[anio].push(idLimpio);
    });

    // 2. Armamos el HTML dibujando la llave sin saltos de línea basura
    let html = "";
    Object.keys(grupos).sort().forEach(anio => {
        html += `<div class="llave-anio">`; 
        html += `<span class="etiqueta-anio">${anio}</span>`; 
        
        let items = [];
        grupos[anio].forEach(id => {
            items.push(`   • ${id} - ${dbMaterias[id]}`);
        });
        html += items.join('\n'); 
        
        html += `</div>`;
    });
    return html;
}

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
// 2. LÓGICA DEL PANEL LATERAL Y MODAL DE INFO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const botonesMaterias = document.querySelectorAll('.materia-btn');
    const panelTitulo = document.getElementById('materia-nombre');
    const panelCondicion1 = document.getElementById('condicion-1');
    const panelCondicion2 = document.getElementById('condicion-2');
    const panelCondicion3 = document.getElementById('condicion-3');
    
    // Elementos del Modal
    const btnMasInfo = document.getElementById('btn-mas-info');
    const modalOverlay = document.getElementById('modal-info');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const btnCerrarModal = document.getElementById('modal-cerrar');

    // Elementos del Carrusel
    const modalControles = document.getElementById('modal-controles');
    const btnIzq = document.getElementById('modal-btn-izq');
    const btnDer = document.getElementById('modal-btn-der');
    const indicador = document.getElementById('modal-indicador');

    let botonActivo = null;
    let paginasModal = []; // Aquí guardaremos las diapositivas
    let paginaActual = 0;

    // Iniciar ocultos
    if(modalOverlay) modalOverlay.classList.add('modal-oculto');
    if(btnMasInfo) btnMasInfo.classList.add('oculto');

    // Función que lee la base de datos de palabras
    function resaltarPalabras(texto) {
        if (!texto) return "";
        return texto
            .replace(/\b(Aprobada|Aprobadas|Aprobado|Aprobados)\b/gi, match => `<span class="texto-aprobado">${match.toUpperCase()}</span>`)
            .replace(/\b(Regular|Regulares|Regularizada|Regularizadas)\b/gi, match => `<span class="texto-regular">${match.toUpperCase()}</span>`);
    }

    // Cerrar Modal
    if (btnCerrarModal && modalOverlay) {
        btnCerrarModal.addEventListener('click', () => modalOverlay.classList.add('modal-oculto'));
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) modalOverlay.classList.add('modal-oculto');
        });
    }

    // MAGIA: Navegación del Carrusel
    function actualizarCarrusel() {
        modalTexto.innerHTML = paginasModal[paginaActual];
        
        if (paginasModal.length > 1) {
            modalControles.classList.remove('oculto');
            indicador.textContent = `${paginaActual + 1} / ${paginasModal.length}`;
            btnIzq.disabled = (paginaActual === 0);
            btnDer.disabled = (paginaActual === paginasModal.length - 1);
        } else {
            modalControles.classList.add('oculto');
        }
    }

    if (btnIzq) btnIzq.addEventListener('click', () => { if(paginaActual > 0) { paginaActual--; actualizarCarrusel(); } });
    if (btnDer) btnDer.addEventListener('click', () => { if(paginaActual < paginasModal.length - 1) { paginaActual++; actualizarCarrusel(); } });

    // ==========================================
    // 3. Click en los botones de las Materias
    // ==========================================

    if (botonesMaterias.length > 0 && panelTitulo) {
        botonesMaterias.forEach(boton => {
            boton.addEventListener('click', () => {
                
                // CASO A: Apagar botón
                if (botonActivo === boton) {
                    panelTitulo.textContent = "Selecciona una materia";
                    panelCondicion1.innerHTML = "Aquí verás los requisitos para poder cursarla o rendirla.";
                    panelCondicion2.innerHTML = "";
                    if(panelCondicion3) panelCondicion3.innerHTML = ""; 
                    if(btnMasInfo) btnMasInfo.classList.add('oculto');
                    boton.style.color = "var(--text-color)";
                    botonActivo = null;
                } 
                // CASO B: Encender botón
                else {
                    botonesMaterias.forEach(b => b.style.color = "var(--text-color)");
                    
                    const idMateria = boton.getAttribute('data-id');
                    const nombre = dbMaterias[idMateria];
                    
                    const reqReg = boton.getAttribute('data-req-cursar-reg'); 
                    const reqAprob = boton.getAttribute('data-req-cursar-aprob');
                    const reqRend = boton.getAttribute('data-req-rendir');
                    const detallesExtensos = boton.getAttribute('data-detalles'); 

                    // --- MINI TRADUCTOR DE PALABRAS MÁGICAS ---
                    function traducirMagia(req) {
                        if (req === "TODAS") return "TODAS las materias";
                        if (req === "TODAS1") return "TODAS las de 1° Año";
                        if (req === "TODAS2") return "TODAS las de 2° Año";
                        if (req === "TODAS3") return "TODAS las de 3° Año";
                        return req; // Si son números normales, los devuelve tal cual
                    }

                    // 1. Panel Lateral (Solo numérico y directo)
                    const textoCursarReg = reqReg ? `Para cursar: tener Regularizadas ${traducirMagia(reqReg)}.` : `Para cursar: Ninguna materia Regular previa.`;
                    const textoCursarAprob = reqAprob ? `Para cursar: tener Aprobadas ${traducirMagia(reqAprob)}.` : `Para cursar: Ninguna materia Aprobada previa.`;
                    const textoRendir = reqRend ? `Para Rendir: tener Aprobadas ${traducirMagia(reqRend)}.` : `Para Rendir: Ninguna materia Aprobada previa.`;

                    panelTitulo.textContent = nombre || boton.textContent;
                    panelCondicion1.innerHTML = resaltarPalabras(textoCursarReg);
                    panelCondicion2.innerHTML = resaltarPalabras(textoCursarAprob);
                    if(panelCondicion3) panelCondicion3.innerHTML = resaltarPalabras(textoRendir);
                    
                    boton.style.color = "var(--primary-color)";
                    botonActivo = boton;

                    // 2. Preparar el Carrusel del Modal
                    if(btnMasInfo) {
                        btnMasInfo.classList.remove('oculto'); 
                        
                        btnMasInfo.onclick = () => {
                            modalTitulo.textContent = nombre || boton.textContent;
                            paginasModal = [];
                            paginaActual = 0;
                            
                            let baseDetalles = resaltarPalabras(detallesExtensos || "");

                            // --- DIAPOSITIVA 1: Cursar (Regulares) ---
                            let htmlReg = `<span class="titulo-lista">📌 Para CURSAR necesitas tener <span class="texto-regular">REGULARIZADAS</span>:</span>`;
                            htmlReg += armarListaAgrupada(reqReg);
                            paginasModal.push(baseDetalles + htmlReg);
                            
                            // --- DIAPOSITIVA 2: Cursar (Aprobadas) ---
                            let htmlAprob = `<span class="titulo-lista">📌 Para CURSAR necesitas tener <span class="texto-aprobado">APROBADAS</span>:</span>`;
                            htmlAprob += armarListaAgrupada(reqAprob);
                            paginasModal.push(baseDetalles + htmlAprob);
                            
                            // --- DIAPOSITIVA 3: Rendir (Aprobadas) ---
                            let htmlRend = `<span class="titulo-lista">🎓 Para RENDIR necesitas tener <span class="texto-aprobado">APROBADAS</span>:</span>`;
                            htmlRend += armarListaAgrupada(reqRend);
                            paginasModal.push(baseDetalles + htmlRend);

                            actualizarCarrusel();
                            modalOverlay.classList.remove('modal-oculto');
                        };
                    }
                }
            });
        });
    }
});

// ==========================================
// 4. EXPANSIÓN INTELIGENTE DE BOTONES (ANTI-SCROLL)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    
    function ajustarRenglones() {
        // Buscamos todas las columnas de materias (1° Año, 2° Año, etc.)
        const listasMaterias = document.querySelectorAll('.botones-materias');
        
        listasMaterias.forEach(lista => {
            // Obtenemos el alto real disponible en la caja
            const altoDisponible = lista.clientHeight;
            
            // Contamos cuántos botones reales hay adentro de ese año
            const cantidadBotones = lista.querySelectorAll('.materia-btn').length;
            if (cantidadBotones === 0) return;
            
            // Calculamos cuántos píxeles le tocaría a cada botón
            const espacioPorBoton = altoDisponible / cantidadBotones;
            
            // Si cada botón tiene más de 45 píxeles de espacio libre, 
            // le damos permiso de usar 2 renglones. Si no, lo limitamos a 1.
            if (espacioPorBoton > 45) {
                lista.classList.add('espacio-sobrado');
            } else {
                lista.classList.remove('espacio-sobrado');
            }
        });
    }

    // Ejecutamos la medición al cargar la página...
    ajustarRenglones();
    
    // ...y también cada vez que el usuario agrande o achique la ventana
    window.addEventListener('resize', ajustarRenglones);
});

// ==========================================
// 5. MEMORIA PERMANENTE (LOCALSTORAGE)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Seleccionamos todos los checkboxes que tengan el atributo data-materia
    const checkboxesMaterias = document.querySelectorAll('input[data-materia]');
    const btnRefresh = document.getElementById('refresh-button');
    
    // MAGIA DE ESCALABILIDAD: Leemos en qué carrera estamos desde el HTML
    const nombreCarrera = document.body.getAttribute('data-carrera') || 'general';
    
    // Nombre del "archivo" único para esta carrera
    const NOMBRE_MEMORIA = 'calculativa_progreso_' + nombreCarrera;

    // 2. FUNCIÓN PARA CARGAR: Lee la memoria al abrir la página
    function cargarProgreso() {
        // Buscamos si hay datos guardados. Si no hay, creamos un objeto vacío {}
        const memoria = JSON.parse(localStorage.getItem(NOMBRE_MEMORIA)) || {};
        
        checkboxesMaterias.forEach(chk => {
            const nombreMateria = chk.getAttribute('data-materia');
            const tipoCheck = chk.getAttribute('data-checkbox');
            
            // Creamos un código único para este checkbox (Ej: "Relación Estado-Sociedad-3")
            const claveUnica = nombreMateria + "-" + tipoCheck;
            
            // Si en la memoria dice que este checkbox estaba tildado, lo tildamos
            if (memoria[claveUnica] === true) {
                chk.checked = true;
            }
        });
    }

    // 3. FUNCIÓN PARA GUARDAR: Toma una foto del estado actual y lo guarda
    function guardarProgreso() {
        const memoria = {}; 
        
        checkboxesMaterias.forEach(chk => {
            const nombreMateria = chk.getAttribute('data-materia');
            const tipoCheck = chk.getAttribute('data-checkbox');
            const claveUnica = nombreMateria + "-" + tipoCheck;
            
            // Solo guardamos los que están marcados para ahorrar espacio
            if (chk.checked) {
                memoria[claveUnica] = true;
            }
        });
        
        // Convertimos el objeto a texto y lo guardamos bajo llave en el navegador
        localStorage.setItem(NOMBRE_MEMORIA, JSON.stringify(memoria));
    }

    // 4. CONECTAMOS LOS CABLES
    // A. Apenas entra el usuario, cargamos sus datos guardados
    cargarProgreso();
    
    // B. Cada vez que el usuario tilda o destilda algo, guardamos automáticamente
    checkboxesMaterias.forEach(chk => {
        chk.addEventListener('change', guardarProgreso);
    });

    // 5. ACTUALIZAR EL BOTÓN REFRESH (La Goma de Borrar)
    if(btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            // Borramos el archivo de la memoria del navegador
            localStorage.removeItem(NOMBRE_MEMORIA);
            
            // (Opcional visual) Si ya tenías un código que destildaba visualmente los checks
            // en la parte de "Evaluar Correlativas", esto lo complementa borrando la raíz.
        });
    }
});

    // ==========================================
    // 6. SISTEMA DE PANEL LATERAL COLAPSABLE
    // ==========================================
    const btnToggleInfo = document.getElementById("btn-toggle-info");
    const wrapper = document.querySelector(".calculadora-wrapper");

    if (btnToggleInfo && wrapper) {
        btnToggleInfo.addEventListener("click", () => {
            wrapper.classList.toggle("panel-colapsado");
        });
    }

    // ==========================================
    // 7. LÓGICA DE LAS CAJAS CAMBIADOR (SELECCIÓN RÁPIDA POR AÑO)
    // ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // Buscamos todas las cajas cambiador del documento
    const cajasCambiador = document.querySelectorAll('.caja-cambiador');

    cajasCambiador.forEach(caja => {
        const checksCambiador = caja.querySelectorAll('.checkbox-materia');
        
        checksCambiador.forEach(chkCambiador => {
            chkCambiador.addEventListener('change', function () {
                const tipoSeleccionado = this.getAttribute('data-checkbox'); // 1 (Rojo), 2 (Naranja) o 3 (Verde)
                
                // Buscamos la columna entera (el año) al que pertenece este cambiador
                const cajaAnio = this.closest('.caja-materias'); 
                
                // Buscamos las materias reales de ese año (ignorando los huecos "materia-none")
                const checksMaterias = cajaAnio.querySelectorAll(`.botones-materias .materia-linea .checkbox-materia[data-checkbox="${tipoSeleccionado}"]`);
                
                checksMaterias.forEach(checkMateria => {
                    // Si el cambiador se encendió, encendemos la materia. Si se apagó, la apagamos.
                    checkMateria.checked = this.checked;
                    
                    // MAGIA PURA: Simulamos que el usuario hizo click manualmente
                    // Esto dispara el autoguardado en LocalStorage y apaga los otros colores
                    checkMateria.dispatchEvent(new Event('change'));
                });
            });
        });
    });
});

    // ==========================================
    // 8. MOTOR MATEMÁTICO (EVALUACIÓN DE CORRELATIVAS)
    // ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const btnCursar = document.getElementById('btn-evaluar-cursar');
    const btnRendir = document.getElementById('btn-evaluar-rendir');
    const botonesMaterias = document.querySelectorAll('.materia-btn');
    const btnRefresh = document.getElementById('refresh-button');

    function obtenerEstadoAlumno() {
        let regulares = new Set();
        let aprobadas = new Set();
        document.querySelectorAll('.checkbox-materia:checked').forEach(chk => {
            let id = chk.getAttribute('data-materia').replace('Materia ', '');
            let tipo = chk.getAttribute('data-checkbox');
            if (tipo === "2") regulares.add(id);
            if (tipo === "3") { aprobadas.add(id); regulares.add(id); }
        });
        return { regulares, aprobadas };
    }

    function cumpleRequisitos(requisitosStr, setAlumno) {
        if (!requisitosStr) return true;
        if (requisitosStr === "TODAS") return setAlumno.size >= Object.keys(dbMaterias).length - 1;
        let reqsArray = requisitosStr.split(',').map(id => id.trim());
        return reqsArray.every(reqId => setAlumno.has(reqId));
    }

    // --- LÓGICA CURSAR ---
    if (btnCursar) {
        btnCursar.addEventListener('click', () => {
            let estado = obtenerEstadoAlumno();
            botonesMaterias.forEach(boton => {
                boton.className = 'materia-btn'; // Reset clases
                let id = boton.getAttribute('data-id');
                let reqReg = boton.getAttribute('data-req-cursar-reg');
                let reqAprob = boton.getAttribute('data-req-cursar-aprob');

                let puedeCursar = cumpleRequisitos(reqReg, estado.regulares) && cumpleRequisitos(reqAprob, estado.aprobadas);
                
                if (puedeCursar) {
                    boton.classList.add('borde-verde'); // Habilitada
                } else {
                    boton.classList.add('borde-rojo'); // Bloqueada
                }
            });
        });
    }

    // --- LÓGICA RENDIR ---
    if (btnRendir) {
        btnRendir.addEventListener('click', () => {
            let estado = obtenerEstadoAlumno();
            botonesMaterias.forEach(boton => {
                boton.className = 'materia-btn'; // Reset clases
                let id = boton.getAttribute('data-id');
                if (!id) return; // Ignora los huecos vacíos
                
                let reqRend = boton.getAttribute('data-req-rendir');
                
                // 1. Calculamos PRIMERO si tiene las materias previas en regla
                let cumpleRendir = cumpleRequisitos(reqRend, estado.aprobadas);

                // 2. Evaluamos en cascada estricta
                if (estado.aprobadas.has(id)) {
                    // El alumno tildó la materia. ¿Pero es legal?
                    if (cumpleRendir) {
                        boton.classList.add('borde-verde'); // ✅ Aprobado Legal
                    } else {
                        boton.classList.add('borde-rojo'); // ❌ ILEGAL: Marcó el check pero le faltan previas
                    }
                } else if (cumpleRendir) {
                    boton.classList.add('borde-azul'); // 🟦 Lista para ir a rendir
                } else {
                    boton.classList.add('borde-rojo'); // ❌ Bloqueada
                }
            });
        });
    }

    // --- LÓGICA BOTÓN REFRESH (RESET INSTANTÁNEO) ---
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            // 1. Borramos la memoria (LocalStorage)
            const nombreCarrera = document.body.getAttribute('data-carrera') || 'general';
            localStorage.removeItem('calculativa_progreso_' + nombreCarrera);

            // 2. Destildamos todos los checkboxes visualmente
            document.querySelectorAll('.checkbox-materia').forEach(chk => {
                chk.checked = false;
            });

            // 3. Quitamos los colores matemáticos de los botones (bordes)
            botonesMaterias.forEach(boton => {
                boton.classList.remove('borde-verde', 'borde-rojo', 'borde-azul');
                boton.style.color = "var(--text-color)"; // Devuelve el texto a color normal
            });

            // 4. Restauramos el panel lateral de información a su estado por defecto
            const panelTitulo = document.getElementById('materia-nombre');
            const panelCondicion1 = document.getElementById('condicion-1');
            const panelCondicion2 = document.getElementById('condicion-2');
            const panelCondicion3 = document.getElementById('condicion-3');
            const btnMasInfo = document.getElementById('btn-mas-info');

            if(panelTitulo) panelTitulo.textContent = "Selecciona una materia";
            if(panelCondicion1) panelCondicion1.innerHTML = "Aquí verás los requisitos para poder cursarla o rendirla.";
            if(panelCondicion2) panelCondicion2.innerHTML = "";
            if(panelCondicion3) panelCondicion3.innerHTML = "";
            if(btnMasInfo) btnMasInfo.classList.add('oculto');
        });
    }
});

