import * as THREE from 'three';
import { textureLoader } from './script';

function Island() {
  const aoTexture = textureLoader.load('textures/sand/ambientOcclusion.jpg');
  const colorTexture = textureLoader.load('textures/sand/color.jpg');
  colorTexture.repeat.x = 15; // repeat on x
  colorTexture.repeat.y = 15;
  colorTexture.wrapS = THREE.RepeatWrapping; // repeat in miroiring
  colorTexture.wrapT = THREE.RepeatWrapping;

  const normalTexture = textureLoader.load('textures/sand/normal.jpg');
  const roughnessTexture = textureLoader.load('textures/sand/roughness.jpg');
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    aoMap: aoTexture,
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
  });

  const island = new THREE.Mesh(geometry, material);
  island.receiveShadow = true;
  island.scale.set(2.5, 2, 2.5);

  return { mesh: island };
}

export default Island;
