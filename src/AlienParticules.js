import * as THREE from 'three';
import { renderer } from './script';
import fragmentGalaxy from './shaders/galaxy/fragment.glsl';
import vertexGalaxy from './shaders/galaxy/vertex.glsl';
import { useRequestAnimationFrame } from './utility';

class AlienParticules {
  constructor({ gui, scene }) {
    this.gui = gui;
    this.parameters = {
      count: 500,
    };
    this.points = null;
    this.scene = scene;

    // gui
    //   .add(this.parameters, 'count', 1, 1000000, 0.1)
    //   .name('Alien particules count');

    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.parameters.count * 3);
    const scales = new Float32Array(this.parameters.count);
    const speeds = new Float32Array(this.parameters.count);

    function randomn() {
      return Math.random() * 0.5;
    }

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;

      positions[i3] = randomn() * 0.5; /// x
      positions[i3 + 1] = randomn(); // y
      positions[i3 + 2] = randomn() * 0.5; // z

      scales[i] = Math.random();
      speeds[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(positions, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertexGalaxy,
      fragmentShader: fragmentGalaxy,
      uniforms: {
        uSize: { value: 10 * renderer.getPixelRatio() },
        uTime: { value: 0 },
      },
    });

    this.points = new THREE.Points(geometry, material);
    this.points.position.set(0.04, -1.1, 0.2);
    this.points.rotation.y = Math.PI * 0.25;

    useRequestAnimationFrame((elapsedTime) => {
      material.uniforms.uTime.value = elapsedTime;
    });

    this.scene.add(this.points);
  }

  reset() {
    if (this.points) {
      this.dispose();
    }
    this.init();
  }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.scene.remove(this.points);
  }
}

export default AlienParticules;
