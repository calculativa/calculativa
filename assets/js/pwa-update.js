// assets/js/pwa-update.js

// 1. DEFINE TU VERSIÓN AQUÍ
const APP_VERSION = '0.2.3'; 

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

    // --- 3. LÓGICA DEL BOTÓN "INSTALAR APP" ---
    let deferredPrompt;
    const installButton = document.getElementById('install-button');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installButton) installButton.style.display = 'block';
    });

    if(installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario ${outcome === 'accepted' ? 'instaló' : 'canceló'}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada');
        deferredPrompt = null;
        if(installButton) installButton.style.display = 'none';
    });


    // --- 4. REGISTRO DEL SERVICE WORKER Y ACTUALIZACIONES ---
    if ('serviceWorker' in navigator) {
        // Lee la variable SW_PATH del HTML. Si no existe, usa './sw.js'
        const swUrl = typeof SW_PATH !== 'undefined' ? SW_PATH : './sw.js';

        navigator.serviceWorker.register(swUrl).then(reg => {
            
            const showUpdateToast = () => {
                const updateToast = document.getElementById('update-toast');
                if (updateToast) {
                    updateToast.classList.add('show');
                    
                    document.getElementById('btn-update-now').onclick = () => {
                        localStorage.setItem('appUpdated', 'true');
                        window.location.reload();
                    };
                    
                    document.getElementById('btn-update-later').onclick = () => {
                        updateToast.classList.remove('show');
                    };
                }
            };

            // Escuchar actualizaciones automáticas
            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing;
                newSW.addEventListener('statechange', () => {
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
    }
});