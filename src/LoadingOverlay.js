import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import fragmentShader from './shaders/overlay/fragment.glsl';
import vertexShader from './shaders/overlay/vertex.glsl';

class LoadingOverlay {
  constructor({ scene, gui, loadingManager }) {
    this.scene = scene;
    this.gui = gui;
    this.mesh = null;

    this.domOverlay = {
      root: document.querySelector('.overlay'),
      bar: document.querySelector('.overlay > .centred > .percentBox > .percentBar'),
      text: document.querySelector('.overlay > .centred > .percent'),
    };

    this._params = { alienAnimationDiviseur: 3 };
    gui.add(this._params, 'alienAnimationDiviseur', 0, 3, 0.01);

    // to avoid using `bind`
    loadingManager.onLoad = () => this.onLoad();
    loadingManager.onProgress = (...params) => this.onProgress(...params);

    this.initOverlay();
  }

  onProgress(url, itemsLoaded, itemsTotal) {
    const percent = itemsLoaded / itemsTotal;
    this.domOverlay.bar.style.transform = `scaleX(${percent})`;
    this.domOverlay.text.innerText = `${Math.round(percent * 100)}%`;
  }

  onLoad() {
    setTimeout(() => {
      gsap
        .to(this.overlay.material.uniforms.uAlpha, {
          duration: 1,
          value: 0,
          onUpdate: () => {
            this.domOverlay.text.innerText = `Let's goo!!`;
            this.domOverlay.root.style.opacity =
              this.overlay.material.uniforms.uAlpha.value;
          },
        })
        .then(() => {
          this.destroyOverlay();
        });
    }, 500);
  }

  initOverlay() {
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      uniforms: {
        uAlpha: { value: 1.0 },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.overlay = mesh;

    this.scene.add(mesh);
  }

  destroyOverlay() {
    this.overlay.material.dispose();
    this.overlay.geometry.dispose();
    this.scene.remove(this.overlay);
    this.domOverlay.root.remove();
    delete this;
  }
}

export default LoadingOverlay;
