import * as THREE from 'three';

// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// CÁMARA 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// WEBGL
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- CORRECCIÓN: CREAR UN GRUPO PARA EL SEMÁFORO ---
const semaforoGrupo = new THREE.Group();
scene.add(semaforoGrupo);

// 1. Cubo alargado en vertical
const cajaSemaforo = new THREE.BoxGeometry(1.2, 3.6, 0.6);
const materialCaja = new THREE.MeshStandardMaterial({
  color: 0x2b2b2b,
  roughness: 0.5,
  metalness: 0.6
});
const cuerpo = new THREE.Mesh(cajaSemaforo, materialCaja);
semaforoGrupo.add(cuerpo); // Añadido al grupo

// 2. Tres esferas una encima de otra con las posiciones de la instrucción
// Nota: Se les añade un pequeño valor en Z (0.31) para que sobresalgan del cubo hacia el frente
const esferaRoja = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
esferaRoja.position.y = 1.2;
esferaRoja.position.z = 0.31; 

const esferaAmarilla = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
esferaAmarilla.position.y = 0;
esferaAmarilla.position.z = 0.31;

const esferaVerde = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
esferaVerde.position.y = -1.2;
esferaVerde.position.z = 0.31;

// Se añaden las esferas al grupo
semaforoGrupo.add(esferaRoja, esferaAmarilla, esferaVerde);

// ILUMINACIÓN
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ANIMACIÓN
function animate() {
  requestAnimationFrame(animate);

  // Rotamos todo el grupo completo para que las luces no se queden estáticas
  semaforoGrupo.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// RESPONSIVIDAD 
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
