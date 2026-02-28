// assets/js/pwa-update.js

// 1. DEFINE TU VERSIÓN AQUÍ
const APP_VERSION = '0.3.2'; 

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VERSIÓN EN EL MENÚ ---
    const versionTag = document.getElementById('app-version');
    if(versionTag) versionTag.textContent = APP_VERSION;

    // --- 2. NOTIFICACIÓN DE ÉXITO POST-ACTUALIZACIÓN ---
    if (localStorage.getItem('appUpdated') === 'true') {
        localStorage.removeItem('appUpdated');
        setTimeout(() => {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('¡App actualizada con éxito a la ' + APP_VERSION + '!', 'celebration', 4500);
            }
        }, 800);
    }

    // --- 3. LÓGICA DEL BOTÓN "INSTALAR APP" Y TOOLTIP ---
    let deferredPrompt;
    const installContainer = document.getElementById('install-container');
    const installButton = document.getElementById('install-button');

    // Escucha si la app está lista para instalarse
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // En lugar de block, usamos flex para mantener el diseño CSS
        if(installContainer) installContainer.style.display = 'flex'; 
    });

    // Acción de instalar
    if(installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            // El navegador destruye el pase después de preguntar, sea cual sea la respuesta
            deferredPrompt = null;
            
            // MAGIA: Ocultamos TODO el contenedor (incluyendo el "?") con un desvanecimiento
            if(installContainer) {
                installContainer.style.transition = 'opacity 0.3s ease';
                installContainer.style.opacity = '0';
                setTimeout(() => {
                    installContainer.style.display = 'none';
                }, 300);
            }
        });
    }

    // Oculta el botón si el usuario la instala por otros medios (ej. menú del navegador)
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        if(installContainer) installContainer.style.display = 'none';
    });

    // --- Lógica del Botón de Ayuda (?) ---
    const infoBtn = document.getElementById('install-info-btn');
    const installTooltip = document.getElementById('install-tooltip');

    if (infoBtn && installTooltip) {
        // Mostrar/Ocultar al tocar el "?"
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se cierre instantáneamente
            installTooltip.classList.toggle('show');
        });

        // Cerrar el cartelito si tocas en cualquier otra parte de la pantalla
        document.addEventListener('click', (e) => {
            if (!infoBtn.contains(e.target) && !installTooltip.contains(e.target)) {
                installTooltip.classList.remove('show');
            }
        });
    }

    if(installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    }

    // --- 4. REGISTRO DEL SERVICE WORKER Y ACTUALIZACIONES ---
    if ('serviceWorker' in navigator) {
        const swUrl = typeof SW_PATH !== 'undefined' ? SW_PATH : './sw.js';

        navigator.serviceWorker.register(swUrl).then(reg => {
            
            const showUpdateToast = () => {
                const updateToast = document.getElementById('update-toast');
                if (updateToast) {
                    updateToast.classList.add('show');
                    
                    document.getElementById('btn-update-now').onclick = () => {
                        localStorage.setItem('appUpdated', 'true');
                        // MAGIA: Le enviamos un mensaje al SW para que despierte y aplique la actualización
                        if (reg.waiting) {
                            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }
                    };
                    
                    document.getElementById('btn-update-later').onclick = () => {
                        updateToast.classList.remove('show');
                    };
                }
            };

            // Escuchar actualizaciones automáticas (Cuando descarga una nueva versión)
            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing;
                newSW.addEventListener('statechange', () => {
                    // Ahora sí se quedará en estado "installed" (waiting) esperando tu orden
                    if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    }
                });
            });

            // Lógica del botón manual
            const btnCheck = document.getElementById('btn-check-updates');
            if (btnCheck) {
                btnCheck.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof mostrarNotificacion === 'function') {
                        mostrarNotificacion('Buscando actualizaciones...', 'sync', 2000);
                    }
                    
                    reg.update().then(() => {
                        if (reg.waiting) {
                            // Si ya había una esperando (le diste a "Más tarde"), la mostramos
                            setTimeout(showUpdateToast, 1000);
                        } else if (!reg.installing) {
                            setTimeout(() => {
                                if (typeof mostrarNotificacion === 'function') {
                                    mostrarNotificacion(`Estás al día (Versión ${APP_VERSION})`, 'verified', 3000);
                                }
                            }, 2000);
                        }
                    }).catch(() => {
                        if (typeof mostrarNotificacion === 'function') {
                            mostrarNotificacion('Error al buscar. Revisa tu conexión.', 'wifi_off', 3000);
                        }
                    });
                });
            }
        });

        // 5. EL RECARGADOR AUTOMÁTICO
        // Escucha cuando el nuevo Service Worker toma el control y recarga la página solo 1 vez
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }
});