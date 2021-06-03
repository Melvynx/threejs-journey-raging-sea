import * as THREE from 'three';
import fragmentShader from './shaders/three/fragment.glsl';
import vertexShader from './shaders/three/vertex.glsl';
import { useRequestAnimationFrame } from './utility';

class ThreeParticules {
  constructor({ gui, scene }) {
    this.gui = gui;
    this.parameters = {
      count: 500,
    };
    this.points = null;
    this.scene = scene;
    this.pixelRatio = 1;

    this.params = {
      radius: 1.2,
      color: '#0e4317',
    };
    this.gui.add(this.params, 'radius', 0, 10, 0.1).onChange(() => this.reset());
    this.gui
      .addColor(this.params, 'color')
      .name('ThreePa. Color')
      .onChange((value) => {
        if (this.points) {
          this.points.material.uniforms.uColor.value = new THREE.Color(value);
        }
      });

    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.parameters.count * 3);
    const scales = new Float32Array(this.parameters.count);
    const speeds = new Float32Array(this.parameters.count);

    function randomn() {
      return Math.random();
    }

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;

      const poistionRadius = Math.random() * 2 * Math.PI;

      positions[i3] = Math.sin(poistionRadius) * Math.random() * this.params.radius; /// x
      positions[i3 + 1] = randomn() * 1.5; // y
      positions[i3 + 2] =
        Math.cos(poistionRadius) * Math.random() * this.params.radius; // z

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
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uSize: { value: 4 * this.pixelRatio },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.params.color) },
      },
    });

    this.points = new THREE.Points(geometry, material);
    this.points.position.y = 0.25;

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

export default ThreeParticules;
