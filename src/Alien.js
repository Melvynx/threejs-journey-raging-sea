import * as THREE from 'three';
import { gltfLoader } from './script';
import { useRequestAnimationFrame } from './utility';

function Alien(onLoad) {
  let mixer;
  let actionOnClick;

  gltfLoader.load('models/Alien.glb', (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    actionOnClick = mixer.clipAction(gltf.animations[5]);

    action.play();

    let isAnimated = false;
    function onActionClick() {
      if (isAnimated) return;
      isAnimated = true;
      action.stop();
      actionOnClick.play();

      setTimeout(() => {
        isAnimated = false;
        actionOnClick.stop();
        action.play();
      }, actionOnClick.loop / 2.5);
    }

    const alien = gltf.scene;
    alien.scale.set(0.1, 0.1, 0.1);
    alien.position.set(0.2, 0.47, 0.2);
    alien.rotation.y = Math.PI * 0.25;
    alien.castShadow = true;

    onLoad({ mesh: gltf.scene, onActionClick });
    console.log(gltf.scene.children[0].children);
    gltf.scene.children[0].children.forEach((child) => {
      child.children.forEach((c) => {
        c.castShadow = true;
      });
    });
  });

  const clock = new THREE.Clock();
  let previousTime = 0;
  useRequestAnimationFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    if (mixer) mixer.update(deltaTime);
  });
}

export default Alien;
