import * as THREE from 'three';

// 1. ESCENA Y RENDERIZADOR
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Fondo color cielo

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 16);

const canvasElement = document.querySelector('#mi-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// 2. ILUMINACIÓN
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(20, 30, 20);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// 3. ENTORNO: TERRENO Y PISTA DE ATERRIZAJE
// Pasto / Terreno
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4baa32 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Pista de Asfalto
const runwayGeo = new THREE.PlaneGeometry(14, 180);
const runwayMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const runway = new THREE.Mesh(runwayGeo, runwayMat);
runway.rotation.x = -Math.PI / 2;
runway.position.y = 0.01;
runway.receiveShadow = true;
scene.add(runway);

// Marcas blancas centrales de la pista
const lineGeo = new THREE.PlaneGeometry(0.6, 6);
const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
for (let z = -80; z <= 80; z += 12) {
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 0.02, z);
  line.receiveShadow = true;
  scene.add(line);
}

// 4. CONSTRUCCIÓN DEL AVIÓN
const airplane = new THREE.Group();

// Fuselaje
const bodyGeo = new THREE.CylinderGeometry(0.8, 0.5, 5, 16);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd93838 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.rotation.z = Math.PI / 2;
body.castShadow = true;
airplane.add(body);

// Cabina
const cockpitGeo = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1 });
const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
cockpit.position.set(0.5, 0.45, 0);
cockpit.scale.set(1.4, 0.8, 0.8);
airplane.add(cockpit);

// Alas Principales
const wingGeo = new THREE.BoxGeometry(1.8, 0.1, 8);
const wingMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const wings = new THREE.Mesh(wingGeo, wingMat);
wings.position.set(0.2, 0, 0);
wings.castShadow = true;
airplane.add(wings);

// Estabilizador Trasero
const tailWingGeo = new THREE.BoxGeometry(1, 0.08, 3);
const tailWing = new THREE.Mesh(tailWingGeo, wingMat);
tailWing.position.set(-2, 0.2, 0);
tailWing.castShadow = true;
airplane.add(tailWing);

// Timón de Cola
const finGeo = new THREE.BoxGeometry(0.8, 1.2, 0.1);
const finMat = new THREE.MeshStandardMaterial({ color: 0xd93838 });
const fin = new THREE.Mesh(finGeo, finMat);
fin.position.set(-2, 0.8, 0);
fin.castShadow = true;
airplane.add(fin);

// Grupo de la Hélice
const propGroup = new THREE.Group();
propGroup.position.set(2.5, 0, 0);

const propHubGeo = new THREE.ConeGeometry(0.3, 0.5, 16);
const propHubMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const propHub = new THREE.Mesh(propHubGeo, propHubMat);
propHub.rotation.z = -Math.PI / 2;
propGroup.add(propHub);

const bladeGeo = new THREE.BoxGeometry(0.1, 2.4, 0.2);
const bladeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const blade = new THREE.Mesh(bladeGeo, bladeMat);
propGroup.add(blade);

airplane.add(propGroup);

// Ruedas
const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

const wheelLeft = new THREE.Mesh(wheelGeo, wheelMat);
wheelLeft.rotation.x = Math.PI / 2;
wheelLeft.position.set(0.5, -0.8, 1);
wheelLeft.castShadow = true;
airplane.add(wheelLeft);

const wheelRight = wheelLeft.clone();
wheelRight.position.set(0.5, -0.8, -1);
airplane.add(wheelRight);

const wheelBack = wheelLeft.clone();
wheelBack.position.set(-1.8, -0.6, 0);
airplane.add(wheelBack);

// Ajustes de posición y orientación del Avión
airplane.rotation.y = Math.PI / 2; // Alinea el avión a lo largo de la pista
airplane.position.set(0, 1.1, 0);
scene.add(airplane);

// 5. REDIMENSIONAMIENTO VENTANA
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. BUCLE DE ANIMACIÓN
function animate() {
  requestAnimationFrame(animate);

  // Rotación de la hélice
  propGroup.rotation.x += 0.3;

  // Movimiento de la cámara alrededor de la escena
  const timer = Date.now() * 0.0005;
  camera.position.x = Math.sin(timer) * 16;
  camera.position.z = Math.cos(timer) * 16;
  camera.position.y = 6;
  camera.lookAt(0, 1.2, 0);

  renderer.render(scene, camera);
}

animate();
