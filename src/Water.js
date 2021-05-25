import * as THREE from 'three';
import vertexShader from './shaders/water/vertex.glsl';
import fragmentShader from './shaders/water/fragment.glsl';
import { useRequestAnimationFrame } from './utility';

function Water({ gui, fog }) {
  const debugObject = {
    depthColor: '#262680',
    surfaceColor: '#6ed2ff',
  };

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
      uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
      uColorOffset: { value: 0.2 },
      uColorMultiplier: { value: 2.3 },
      uCnoiseFrequency: { value: 3 },
      uCnoiseElevation: { value: 0.173 },
      uCnoiseSpeed: { value: 0.5 },
      uCnoiseIterations: { value: 3 },
      fogColor: { type: 'c', value: fog.color },
      fogNear: { type: 'f', value: fog.near },
      fogFar: { type: 'f', value: fog.far },
    },
  });

  // Mesh
  const water = new THREE.Mesh(waterGeometry, waterMaterial);

  const cnoiseGroup = gui.addFolder('CNOISE');
  cnoiseGroup
    .add(waterMaterial.uniforms.uCnoiseFrequency, 'value', 0, 20, 0.1)
    .name('uCnoiseFrequency');
  cnoiseGroup
    .add(waterMaterial.uniforms.uCnoiseIterations, 'value', 1, 6, 1)
    .name('uCnoiseIterations');
  cnoiseGroup
    .add(waterMaterial.uniforms.uCnoiseSpeed, 'value', 0, 10, 0.01)
    .name('uCnoiseSpeed');
  cnoiseGroup
    .add(waterMaterial.uniforms.uCnoiseElevation, 'value', 0, 0.5, 0.001)
    .name('uCnoiseElevation');
  cnoiseGroup
    .add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, 0.1)
    .name('uColorMultiplier');

  const waveGroup = gui.addFolder('WAVE');
  waveGroup
    .add(waterMaterial.uniforms.uBigWaveAmplitude, 'value', 0, 2, 0.01)
    .name('uBigWaveAmplitude');
  waveGroup
    .add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.01)
    .name('uColorOffset');
  waveGroup
    .add(waterMaterial.uniforms.uBigWavePeriode.value, 'x', 0, 10, 0.01)
    .name('uBigWavePeriode X');
  waveGroup
    .add(waterMaterial.uniforms.uBigWavePeriode.value, 'y', 0, 10, 0.01)
    .name('uBigWavePeriode Y');
  waveGroup
    .add(waterMaterial.uniforms.uBigWaveSpeed, 'value', 0, 10, 0.01)
    .name('uBigWaveSpeed');
  waveGroup.addColor(debugObject, 'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value = new THREE.Color(
      debugObject.depthColor
    );
  });
  waveGroup.addColor(debugObject, 'surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(
      debugObject.surfaceColor
    );
  });

  const stop = useRequestAnimationFrame((elapsedTime) => {
    water.material.uniforms.uTime.value = elapsedTime;
  });

  function destroy() {
    stop();
    water.remove();
    waterMaterial.dispose();
  }

  return { mesh: water, destroy };
}

export default Water;
