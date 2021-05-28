import * as THREE from 'three';
import AlienParticules from './AlienParticules';
import { gltfLoader } from './script';
import { useRequestAnimationFrame } from './utility';

class Alien {
  constructor({ scene, gui }) {
    this.scene = scene;
    this.gui = gui;
    this.mesh = null;

    // private
    this._animations = null;
    this._mixer = null;
    this._isJump = false;

    this._params = { alienAnimationDiviseur: 3 };
    gui.add(this._params, 'alienAnimationDiviseur', 0, 3, 0.01);

    this.load();
  }

  load() {
    gltfLoader.load('models/Alien.glb', (gltf) => {
      this._mixer = new THREE.AnimationMixer(gltf.scene);

      const alien = gltf.scene;

      this._mixer = new THREE.AnimationMixer(alien);
      this._mixer.clipAction(gltf.animations[0]).play();
      this._animations = {
        breathe: this._mixer.clipAction(gltf.animations[0]),
        jump: this._mixer.clipAction(gltf.animations[1]),
      };

      this._animations.breathe.play();

      alien.scale.set(0.1, 0.1, 0.1);
      alien.position.set(0.2, 0.415, 0.2);
      alien.rotation.y = Math.PI * 0.25;

      alien.castShadow = true;

      alien.children[0].children.forEach((childs) =>
        childs.children.forEach((child) => {
          child.castShadow = true;
        })
      );

      this.mesh = alien;
      this.scene.add(alien);
    });

    const clock = new THREE.Clock();
    let previousTime = 0;
    useRequestAnimationFrame(() => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      if (this._mixer) this._mixer.update(deltaTime);
    });
  }

  jump() {
    if (!this._animations) return;

    const { breathe, jump } = this._animations;

    const particules = new AlienParticules({ scene: this.scene, gui: this.gui });

    if (this._isJump) return;

    this._isJump = true;
    breathe.stop();
    jump.play();

    setTimeout(() => {
      this._isJump = false;
      jump.stop();
      breathe.play();
      setTimeout(() => particules.dispose(), 2 * 1000);
    }, jump.loop / this._params.alienAnimationDiviseur);
  }
}

export default Alien;
