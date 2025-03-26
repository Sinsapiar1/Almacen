// Este archivo debe guardarse como js/particles-layer.js
document.addEventListener('DOMContentLoaded', function() {
    // Crear capa de partículas entre el fondo 3D y el contenido
    const particlesLayer = document.createElement('div');
    particlesLayer.className = 'particles-layer';
    document.body.appendChild(particlesLayer);

    // Crear canvas para las partículas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesLayer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Configuración de partículas
    const particles = [];
    const particleCount = 50;
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2,
            color: '#1a56db' // Color azul para coincidir con tu tema
        });
    }
    
    // Función para dibujar partículas
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar cada partícula
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
        
        // Dibujar líneas de conexión entre partículas cercanas
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#1a56db';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Función para actualizar posiciones de partículas
    function updateParticles() {
        particles.forEach(particle => {
            // Mover partículas
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebote en los bordes
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
    }
    
    // Bucle de animación
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // Iniciar animación
    animate();
    
    // Ajustar tamaño en caso de redimensión de ventana
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Efecto de movimiento suave con el mouse
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach(particle => {
            // Mover ligeramente las partículas hacia el cursor
            particle.x += (mouseX - 0.5) * 0.2;
            particle.y += (mouseY - 0.5) * 0.2;
        });
    });
});