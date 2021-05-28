import { gltfLoader } from './script';

class Island {
  constructor({ scene, gui }) {
    this.scene = scene;
    this.gui = gui;
    this.mesh = null;

    this._params = { alienAnimationDiviseur: 3 };
    gui.add(this._params, 'alienAnimationDiviseur', 0, 3, 0.01);

    this.load();
  }

  load() {
    gltfLoader.load('models/Island.glb', (gltf) => {
      const island = gltf.scene;
      island.children[0].receiveShadow = true;

      island.scale.set(0.1, 0.1, 0.1);
      island.position.y = -0.5;

      island.receiveShadow = true;

      this.mesh = island;
      this.scene.add(island);
    });
  }
}

export default Island;
