import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import Water from './Water';
import Island from './Island';
import { useRequestAnimationFrame } from './utility';
import Alien from './Alien';

export const gltfLoader = new GLTFLoader();
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

// Scene
const scene = new THREE.Scene();
scene.fog = fog;

/**
 * Light
 */
const ambiantLight = new THREE.AmbientLight('#ffffff', 0.4);
ambiantLight.position.y = 10;
scene.add(ambiantLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.2);
directionalLight.position.set(1, 2, 1);
scene.add(directionalLight);

const directionalLightBig = new THREE.DirectionalLight('#f0f0f0', 0.7, 10);

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
gltfLoader.load('models/Tree.glb', (gltf) => {
  console.log(gltf.scene.children[0].children);
  scene.add(gltf.scene);
  gltf.scene.castShadow = true;
  gltf.scene.children[0].children.forEach((child) => {
    console.log(child.material);
    child.material.lightMapIntensity = 10;
    child.castShadow = true;
  });
});

let alien = null;
let onAlienActionClick = null;
Alien(({ mesh, onActionClick }) => {
  scene.add(mesh);
  console.log('AAAAA', mesh);
  alien = mesh;
  onAlienActionClick = onActionClick;
});
/**
 * Water
 */
// Mesh
const { mesh: water } = Water({ gui, fog: scene.fog });
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

const { mesh: island } = Island();
island.position.y = -0.5;
scene.add(island);

// scene.add(island);

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
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#414141');

/**
 * Click
 */

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
window.addEventListener('click', (event) => {
  raycaster.setFromCamera(mouse, camera);
  const x = alien.children[0].children.map((c) => c.children).flat();

  if (raycaster.intersectObjects(x).length > 0) {
    console.log('alien hit');
    onAlienActionClick();
  }
});

/**
 * Animate
 */

useRequestAnimationFrame(() => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
});
