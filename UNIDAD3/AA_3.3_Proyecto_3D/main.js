import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//renderizar el canvas
const canvas = document.querySelector('#canvas');

//crear la escena
const escena = new THREE.Scene();
escena.background = new THREE.Color(0xB5C2D1);

//crear la camara
const camara = new THREE.PerspectiveCamera(
    60, //FOV es el angulo de vision vertical de arriba hacia abajo, en grados  
    window.innerWidth / window.innerHeight, // ancho y alto de la ventana del navegador, para que la camara se ajuste a la pantalla
     0.1, // distancia de la camara al objeto más cercano 10cm
     1000 // distancia de la camara al objeto más lejano 1km
    );

    camara.position.set(0, 5, 12); // posicion en y 5 unidades y en z 12 unidades, en donde cada unidad es un metro, por lo que la camara esta a 5 metros de altura y 12 metros de distancia del objeto

    // crear el renderizador
    const renderizador = new THREE.WebGLRenderer({canvas, antialias: true});
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // para que la imagen se vea nítida en pantallas de alta resolución

    renderizador.shadowMap.enabled = true; // habilitar sombras
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap; // tipo de sombra

    const luzAmb = new THREE.AmbientLight(0xffffff, 0.4); 
    escena.add(luzAmb); // luz ambiental blanca con intensidad de 0.4

    const luzSol = new THREE.DirectionalLight(0xffffff, 0.8); // luz direccional blanca con intensidad de 1
    luzSol.position.set(5, 10, 2); // posicion de la luz en x, y, z
    luzSol.castShadow = true;
    luzSol.shadow.mapSize.width = 1024; // tamaño del mapa de sombras
    luzSol.shadow.mapSize.height = 1024; // tamaño del mapa de sombras
    luzSol.shadow.camera.near = -0.005;

    escena.add(luzSol); // agregar la luz direccional a la escena

    const controls = new OrbitControls(camara, renderizador.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const textureLoader = new THREE.TextureLoader();

    const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
    const materialCubo = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, // Color  base, que se verá afectado por la textura
        map: textureLoader.load('https://threejs.org/examples/textures/crate.jpg'), // Cargar textura del cubo
        roughness: 0.7, // Controla la rugosidad de la superficie del cubo
        metalness: 0.1  // Controla el nivel de metalicidad del cubo
    });
    const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
    escena.add(cubo);
    cubo.castShadow = true; // El cubo proyectará sombras

    const pedestalArriba = 0.8;
    const pedestalFondo = 1.0;
    const pedestalAltura = 0.2;
    const separacionPedestal = 0.8
    const pedestalSEgmentos = 6;  //Número de segmentos del cilindro
    const geometriaPedestal = new THREE.CylinderGeometry(pedestalArriba, pedestalFondo, pedestalAltura, pedestalSEgmentos);
    const materialPedestal = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color base del pedestal
    const pedestal = new THREE.Mesh(geometriaPedestal, materialPedestal);
    pedestal.position.y = 0;
    pedestal.castShadow = true; // El pedestal proyectará sombras
    pedestal.receiveShadow = true; // El pedestal recibirá sombras
    escena.add(pedestal);

    const esferaRadio = 0.3; //Radio de la esfera
    const esferaSegmentos = 32; //Número de segmentos de la esfera
    const geometriaEsfera = new THREE.SphereGeometry(esferaRadio, esferaSegmentos, esferaSegmentos);
    const materialEsfera = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
    esfera.position.y = 2.5;
    esfera.castShadow = true; // La esfera proyectará sombras
    esfera.receiveShadow = true; // La esfera recibirá sombras
    escena.add(esfera);
    cubo.position.y = 0.2 + separacionPedestal;


    window.addEventListener ('resize',()=>{
        camara.aspect =window.innerWidth / window.innerHeight;
        camara.updateProjectionMatrix();
        renderizador.setSize(window.innerWidth , window.innerHeight);
        renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

      function animar() {
        //cubo.rotation.x += 0.01;
        cubo.rotation.y += 0.01;
        esfera.rotation.y += 0.01;

        controls.update();
        renderizador.render(escena, camara);
    }
    renderizador.setAnimationLoop(animar); // Llamar a la función de animación en cada frame
