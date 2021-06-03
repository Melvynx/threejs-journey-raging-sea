import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import Water from './Water';
import Island from './Island';
import { useRequestAnimationFrame } from './utility';
import Alien from './Alien';
import Trees from './Trees';
import Stats from 'stats.js';
import ThreeParticules from './ThreeParticules';

const stats = new Stats();
stats.showPanel(0);
window.document.body.appendChild(stats.dom);

export const gltfLoader = new GLTFLoader();
export const cubeTextureLoader = new THREE.CubeTextureLoader();
export const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

const fog = new THREE.Fog();
fog.near = 0;
fog.far = 8;
fog.color.set('#414141');

const environmentMap = cubeTextureLoader.load([
  '/textures/cube/px.png',
  '/textures/cube/nx.png',
  '/textures/cube/py.png',
  '/textures/cube/ny.png',
  '/textures/cube/pz.png',
  '/textures/cube/nz.png',
]);

// Scene
const scene = new THREE.Scene();
scene.fog = fog;
scene.environment = environmentMap;
scene.background = environmentMap;

/**
 * Light
 */
const ambiantLight = new THREE.AmbientLight('#ffffff', 0.4);
ambiantLight.position.y = 10;
scene.add(ambiantLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.2);
directionalLight.position.set(1, 2, 1);
scene.add(directionalLight);

const directionalLightBig = new THREE.DirectionalLight('#f0f0f0', 1, 10);

directionalLightBig.position.set(-3, 2, 2);
directionalLightBig.castShadow = true;

directionalLightBig.shadow.camera.near = 0.1;
directionalLightBig.shadow.camera.far = 5;
directionalLightBig.shadow.camera.right = 2;
directionalLightBig.shadow.camera.left = -2;
directionalLightBig.shadow.camera.top = 2;
directionalLightBig.shadow.camera.bottom = -2;
scene.add(directionalLightBig);
/**
 * Boat
 */

/**
 * Water
 */
// Mesh
const water = new Water({ scene, gui });
water.mesh.rotation.x = -Math.PI * 0.5;

const alien = new Alien({ scene, gui });
new Island({ gui, scene });
new Trees({ gui, scene });
const threeParticules = new ThreeParticules({ gui, scene });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeParticules.pixelRatio = renderer.getPixelRatio();
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});
export { renderer };

renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
threeParticules.pixelRatio = renderer.getPixelRatio();
renderer.setClearColor('#414141');
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.2;

/**
 * Click
 */

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const alienChildren = alien.mesh.children[0].children
    .map((c) => c.children)
    .flat();

  if (raycaster.intersectObjects(alienChildren).length > 0) {
    alien.jump();
  }
});

/**
 * Animate
 */

useRequestAnimationFrame(() => {
  stats.begin();
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  stats.end();
});
