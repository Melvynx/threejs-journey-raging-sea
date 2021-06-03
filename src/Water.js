import * as THREE from 'three';
import vertexShader from './shaders/water/vertex.glsl';
import fragmentShader from './shaders/water/fragment.glsl';
import { useRequestAnimationFrame } from './utility';

class Water {
  constructor({ gui, scene }) {
    this.gui = gui;
    this.scene = scene;

    this.params = {
      depthColor: '#262680',
      surfaceColor: '#6ed2ff',
    };

    this.init();
  }

  init() {
    const waterGeometry = new THREE.PlaneGeometry(20, 20, 512, 512);

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      fog: true,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWaveAmplitude: { value: 0.25 },
        uBigWavePeriode: { value: new THREE.Vector2(4, 0) },
        uBigWaveSpeed: { value: 0.75 },
        uDepthColor: { value: new THREE.Color(this.params.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.params.surfaceColor) },
        uColorOffset: { value: 0.2 },
        uColorMultiplier: { value: 2.3 },
        uCnoiseFrequency: { value: 3 },
        uCnoiseElevation: { value: 0.173 },
        uCnoiseSpeed: { value: 0.5 },
        uCnoiseIterations: { value: 3 },
        fogColor: { type: 'c', value: this.scene.fog.color },
        fogNear: { type: 'f', value: this.scene.fog.near },
        fogFar: { type: 'f', value: this.scene.fog.far },
      },
    });

    // Mesh
    this.mesh = new THREE.Mesh(waterGeometry, waterMaterial);

    this.scene.add(this.mesh);

    this.addTick();
    this.addDebug();
  }

  addTick() {
    this.stopTick = useRequestAnimationFrame((elapsedTime) => {
      this.mesh.material.uniforms.uTime.value = elapsedTime;
    });
  }

  destroy() {
    this.stopTick();
    this.mesh.material.dispose();
    this.mesh.geometry.dispose();
    this.scene.remove(this.mesh);
    this.mesh.remove();
  }

  addDebug() {
    const material = this.mesh.material;

    const cnoiseGroup = this.gui.addFolder('CNOISE');
    cnoiseGroup
      .add(material.uniforms.uCnoiseFrequency, 'value', 0, 20, 0.1)
      .name('uCnoiseFrequency');
    cnoiseGroup
      .add(material.uniforms.uCnoiseIterations, 'value', 1, 6, 1)
      .name('uCnoiseIterations');
    cnoiseGroup
      .add(material.uniforms.uCnoiseSpeed, 'value', 0, 10, 0.01)
      .name('uCnoiseSpeed');
    cnoiseGroup
      .add(material.uniforms.uCnoiseElevation, 'value', 0, 0.5, 0.001)
      .name('uCnoiseElevation');
    cnoiseGroup
      .add(material.uniforms.uColorMultiplier, 'value', 0, 10, 0.1)
      .name('uColorMultiplier');

    const waveGroup = this.gui.addFolder('WAVE');
    waveGroup
      .add(material.uniforms.uBigWaveAmplitude, 'value', 0, 2, 0.01)
      .name('uBigWaveAmplitude');
    waveGroup
      .add(material.uniforms.uColorOffset, 'value', 0, 1, 0.01)
      .name('uColorOffset');
    waveGroup
      .add(material.uniforms.uBigWavePeriode.value, 'x', 0, 10, 0.01)
      .name('uBigWavePeriode X');
    waveGroup
      .add(material.uniforms.uBigWavePeriode.value, 'y', 0, 10, 0.01)
      .name('uBigWavePeriode Y');
    waveGroup
      .add(material.uniforms.uBigWaveSpeed, 'value', 0, 10, 0.01)
      .name('uBigWaveSpeed');
    waveGroup.addColor(this.params, 'depthColor').onChange(() => {
      material.uniforms.uDepthColor.value = new THREE.Color(this.params.depthColor);
    });
    waveGroup.addColor(this.params, 'surfaceColor').onChange(() => {
      material.uniforms.uSurfaceColor.value = new THREE.Color(
        this.params.surfaceColor
      );
    });
  }
}

export default Water;
