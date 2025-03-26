// Este archivo debe guardarse como js/3d-background.js
document.addEventListener('DOMContentLoaded', function() {
    // Crear contenedor para el fondo 3D
    const container = document.createElement('div');
    container.id = 'background-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-2'; // Asegura que esté detrás de todo
    document.body.appendChild(container);

    // Cargar Three.js desde CDN si no está disponible
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        document.head.appendChild(script);
        
        // Cargar GSAP para animaciones
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
        document.head.appendChild(gsapScript);
        
        // Esperar a que se carguen las bibliotecas
        script.onload = function() {
            gsapScript.onload = function() {
                initBackground();
            };
        };
    } else {
        initBackground();
    }

    function initBackground() {
        // Escena, Cámara y Renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x141414, 0.9); // Color base con transparencia
        container.appendChild(renderer.domElement);

        // Uniforms del Shader
        const uniforms = {
            uSmoothness: { value: 1.0 },
            uGridDensity: { value: 26.0 },
            uNoiseScale: { value: 10.0 },
            uNoiseSpeed: { value: 0.5 },
            uNoiseStrength: { value: 0.15 },
            uEnableDisplacement: { value: true },
            uTime: { value: 0.0 },
            uWireColor: { value: new THREE.Color(0x1a56db) }, // Color azul para coincidir con tu tema
            uBaseColor: { value: new THREE.Color(0x141414) }
        };

        // Material con Shader para el Wireframe
        const wireframeMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uSmoothness;
                uniform float uGridDensity;
                uniform float uNoiseScale;
                uniform float uNoiseSpeed;
                uniform float uNoiseStrength;
                uniform bool uEnableDisplacement;
                uniform float uTime;
                uniform vec3 uWireColor;
                uniform vec3 uBaseColor;

                varying vec2 vUv;

                // Función de Ruido Perlin Simple
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);

                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));

                    vec2 u = f * f * (3.0 - 2.0 * f);

                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    // Generar líneas de la rejilla
                    vec2 grid = abs(fract(vUv * uGridDensity - 0.5) - 0.5);
                    vec2 gridWidth = fwidth(vUv * uGridDensity);
                    float lineX = smoothstep(0.0, gridWidth.x * uSmoothness, grid.x);
                    float lineY = smoothstep(0.0, gridWidth.y * uSmoothness, grid.y);
                    float line = 1.0 - min(lineX, lineY);

                    // Ruido Perlin para desplazamiento
                    float noiseValue = 0.0;
                    if (uEnableDisplacement) {
                        noiseValue = noise(vUv * uNoiseScale + uTime * uNoiseSpeed) * uNoiseStrength;
                    }

                    // Combinar color base y wireframe con distorsión de ruido
                    vec3 finalColor = mix(uBaseColor, uWireColor, line);
                    finalColor += noiseValue;

                    gl_FragColor = vec4(finalColor, line * 0.7); // Ajustar transparencia
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });

        // Ruta del Túnel y Geometría
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(3, 2, -20),
            new THREE.Vector3(-3, -2, -30),
            new THREE.Vector3(0, 0, -40),
            new THREE.Vector3(2, 1, -50),
            new THREE.Vector3(-2, -1, -60),
            new THREE.Vector3(0, 0, -70),
        ]);

        const geometry = new THREE.TubeGeometry(path, 300, 2, 32, false);
        const tube = new THREE.Mesh(geometry, wireframeMaterial);
        scene.add(tube);

        // Movimiento del Mouse - Efecto de Cámara
        const mouse = { x: 0, y: 0 };

        window.addEventListener("mousemove", (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animación de Cámara con GSAP
        let percentage = { value: 0 };
        gsap.to(percentage, {
            value: 1,
            duration: 15, // Más lento para no distraer tanto
            ease: "linear",
            repeat: -1,
            onUpdate: () => {
                const p1 = path.getPointAt(percentage.value % 1);
                const p2 = path.getPointAt((percentage.value + 0.01) % 1);

                // Efecto de temblor basado en movimiento del mouse
                const shakeX = mouse.x * 0.2;
                const shakeY = mouse.y * 0.2;

                camera.position.set(p1.x + shakeX, p1.y + shakeY, p1.z);
                camera.lookAt(p2);
            }
        });

        // Bucle de Animación
        function render() {
            uniforms.uTime.value += 0.005; // Incremento de tiempo más lento
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        render();

        // Manejo de Redimensionamiento de Ventana
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});