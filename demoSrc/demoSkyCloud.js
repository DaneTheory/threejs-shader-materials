import * as dat from "dat.gui";
import { Common } from "./Common";
import { Color, Fog, Mesh, PlaneGeometry } from "three";
import { SkyCloudMaterial } from "../bin";
import { CommonGUI } from "./CommonGUI";

export class Study {
  constructor() {
    const W = 1024;
    const H = 768;

    const scene = Common.initScene();
    Common.initLight(scene);
    scene.fog = new Fog(0x557799, 2000, 10000);
    const camera = Common.initCamera(scene, W, H, 20000);
    const renderer = Common.initRenderer(W, H, 0x000000, "webgl-canvas", false);
    const control = Common.initControl(camera, renderer);
    Common.initHelper(scene);

    const gui = new dat.GUI();
    Common.initSky(scene, gui);
    const mat = this.initObject(scene);
    Common.render(control, renderer, scene, camera);
    this.initGUI(gui, mat);
  }

  initObject(scene) {
    const size = 20000;
    const geo = new PlaneGeometry(size, size);
    const mat = new SkyCloudMaterial({
      fog: scene.fog !== undefined
    });
    const mesh = new Mesh(geo, mat);
    mesh.position.y = 800;
    mesh.rotation.x = Math.PI / 2;

    mat.scale = 24.0;
    mat.skyColor = new Color(0x1155aa);
    mat.cloudVolume = 4.0;
    scene.add(mesh);

    return mat;
  }

  initGUI(gui, mat) {
    CommonGUI.initMaterialGUI(gui, mat);
    this.initGUIMaterial(gui, mat);
    this.initGUISkyAnimation(gui, mat);
    this.initGUISkyColor(gui, mat);
  }

  initGUIMaterial(gui, mat) {
    const folder = gui.addFolder("SkyCloudMaterial");
    folder.add(mat, "scale", 0.1, 128).step(0.1);
    folder.add(mat, "cloudVolume", 1.0, 128.0);
    folder.open();
  }

  initGUISkyAnimation(gui, mat) {
    const folder = gui.addFolder("SkyCloudMaterial - Animation");

    folder.add(mat, "isAnimate");
    folder.add(mat, "speed", -2.0, 2.0);
    folder.add(mat, "cloudTransformSpeed", 0.0, 20.0);

    folder.open();
  }

  initGUISkyColor(gui, mat) {
    const folder = gui.addFolder("SkyCloudMaterial - Color");
    const prop = CommonGUI.initColorGUI(folder, mat, "skyColor");
    folder.add(mat, "cloudBottomVolume", 0.0, 0.3).step(0.01);
    folder.add(mat, "cloudBottomSaturation", 0.0, 0.7).step(0.01);

    folder.open();
  }
}

window.onload = () => {
  const study = new Study();
};
