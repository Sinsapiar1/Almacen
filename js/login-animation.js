// Versión simplificada y robusta de login-animation.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de animación de login cargado");
    // Función para detectar dispositivos móviles y aplicar soluciones específicas
function fixMobileRegistration() {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log("Aplicando solución para registro en móviles");
        
        // Buscar el botón de registro
        const registerBtn = document.querySelector('.register-btn');
        
        if (registerBtn) {
            // Reemplazar el comportamiento del botón para móviles
            registerBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // En lugar de animar, redirigir a una URL específica para registro
                window.location.href = 'login.html?register=true';
            });
        }
    }
}

// Ejecutar la función cuando cargue la página
document.addEventListener('DOMContentLoaded', fixMobileRegistration);
    // Función para alternar entre formularios
    function setupFormToggle() {
        // Buscar elementos por varias estrategias para mayor compatibilidad
        const container = document.querySelector('.auth-container') || document.querySelector('.login-container');
        
        // Buscar todos los posibles botones de registro
        const registerBtns = document.querySelectorAll('.register-btn, button[class*="register"], a[class*="register"]');
        
        // Buscar todos los posibles botones de login
        const loginBtns = document.querySelectorAll('.login-btn, button[class*="login"], a[class*="login"]');
        
        console.log("Container encontrado:", !!container);
        console.log("Botones de registro encontrados:", registerBtns.length);
        console.log("Botones de login encontrados:", loginBtns.length);
        
        // Si encontramos el contenedor y al menos un botón
        if (container) {
            // Comprobar URL para activar registro si es necesario
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('form') === 'register' || urlParams.get('register') === 'true') {
                container.classList.add('active');
                console.log("Activando formulario de registro por parámetro URL");
            }
            
            // Configurar todos los botones de registro encontrados
            registerBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    container.classList.add('active');
                    console.log("Botón de registro clickeado - activando");
                });
            });
            
            // Configurar todos los botones de login encontrados
            loginBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    container.classList.remove('active');
                    console.log("Botón de login clickeado - desactivando");
                });
            });
            
            // Si hay un formulario de login, asegurar su funcionamiento
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById('email')?.value || '';
                    const password = document.getElementById('password')?.value || '';
                    
                    console.log("Formulario de login enviado");
                    if (typeof loginUser === 'function') {
                        loginUser(email, password);
                    } else {
                        console.error("Función loginUser no encontrada");
                    }
                });
            }
            
            // Si hay un formulario de registro, asegurar su funcionamiento
            const registerForm = document.getElementById('registerForm');
            if (registerForm) {
                registerForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Usar selectores flexibles para encontrar los campos
                    const fullName = document.getElementById('fullName')?.value || '';
                    const email = document.querySelector('.register #email, #register-email')?.value || '';
                    const password = document.querySelector('.register #password, #register-password')?.value || '';
                    const confirmPassword = document.getElementById('confirmPassword')?.value || '';
                    
                    console.log("Formulario de registro enviado");
                    
                    // Validar coincidencia de contraseñas
                    if (password !== confirmPassword) {
                        if (typeof showToast === 'function') {
                            showToast('Las contraseñas no coinciden', 'warning');
                        } else {
                            alert('Las contraseñas no coinciden');
                        }
                        return;
                    }
                    
                    if (typeof registerUser === 'function') {
                        registerUser(email, password, fullName);
                    } else {
                        console.error("Función registerUser no encontrada");
                    }
                });
            }
        }
    }
    
    // Ejecutar la configuración
    setupFormToggle();
    
    // Por si el DOM cambia, intentar nuevamente después de un breve retraso
    setTimeout(setupFormToggle, 500);
});