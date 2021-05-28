import { gltfLoader } from './script';

class Trees {
  constructor({ scene, gui }) {
    this.scene = scene;
    this.gui = gui;
    this.mesh = null;

    this._params = { alienAnimationDiviseur: 3 };
    gui.add(this._params, 'alienAnimationDiviseur', 0, 3, 0.01);

    this.load();
  }

  load() {
    gltfLoader.load('models/SmallTree.glb', (gltf) => {
      const smallTree = gltf.scene;

      // flower.scale.set(0.1, 0.1, 0.1);
      smallTree.position.set(-0.5, 0.32, 0.21);

      smallTree.receiveShadow = true;

      this.mesh = smallTree;
      this.scene.add(smallTree);
    });

    gltfLoader.load('models/Tree.glb', (gltf) => {
      gltf.scene.children[0].children.forEach((child) => {
        child.material.lightMapIntensity = 10;
        child.castShadow = true;
      });
      gltf.scene.position.set(-0.05, 0, -0.05);

      this.scene.add(gltf.scene);
    });
  }
}

export default Trees;
