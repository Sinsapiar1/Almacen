// login-animation.js
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.login-container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    // Check if we're in the login page
    if (container && registerBtn && loginBtn) {
        // Check URL parameters to see if we should show register form
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('form') === 'register') {
            container.classList.add('active');
        }
        
        // Set up click events for the toggle buttons
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
        
        // Make sure forms submit correctly by fixing element IDs
        const loginEmail = document.querySelector('.login #email');
        const loginPassword = document.querySelector('.login #password');
        const registerEmail = document.querySelector('.register #email');
        const registerPassword = document.querySelector('.register #password');
        
        // Fix IDs to be unique
        if (loginEmail && registerEmail) {
            registerEmail.id = 'register-email';
        }
        
        if (loginPassword && registerPassword) {
            registerPassword.id = 'register-password';
        }
        
        // Update form submissions to work with the new IDs
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Call the login function from auth.js
                loginUser(email, password);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const fullName = document.getElementById('fullName').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                // Validate password match
                if (password !== confirmPassword) {
                    if (typeof showToast === 'function') {
                        showToast('Las contraseñas no coinciden', 'warning');
                    } else {
                        alert('Las contraseñas no coinciden');
                    }
                    return;
                }
                
                // Call the register function from auth.js
                registerUser(email, password, fullName);
            });
        }
    }
});