// nav.js
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            firebase.auth().signOut()
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                });
        });
    }

    // Aquí puedes añadir otros eventos de navegación si es necesario
});