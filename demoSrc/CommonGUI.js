import { TextureLoader } from "three";
import { Directions } from "../bin";

export class CommonGUI {
  static initColorGUI(folder, mat, propName = "color") {
    const prop = {};
    const targetColor = mat[propName];
    prop[propName] = targetColor.getHex();
    folder.addColor(prop, propName).onChange(val => {
      targetColor.setHex(val);
    });
    return prop;
  }

  static initMaterialGUI(gui, mat) {
    const folder = gui.addFolder("Material");
    this.initColorGUI(folder, mat);
    folder.add(mat, "transparent");
    folder.add(mat, "opacity", 0.0, 1.0);
    folder.open();
  }

  static initWavyMaterialGUI(gui, mat) {
    this.initMaterialGUI(gui, mat);

    const prop = {
      mask: "",
      alphaMap: ""
    };

    const folder = gui.addFolder("WavyGridMaterial");

    folder.add(mat, "isReversed");
    folder.add(mat, "division", 2.0, 256.0).step(1);
    folder.add(mat, "divisionScaleX", 0.0, 4.0).step(1);

    folder
      .add(prop, "mask", {
        none: "",
        earth: "./textures/landmask.png"
      })
      .onChange(val => {
        if (val === "") {
          mat.maskTexture = null;
        } else {
          mat.maskTexture = new TextureLoader().load(val);
        }
      });

    folder
      .add(prop, "alphaMap", {
        none: "",
        earth: "./textures/landmask.png"
      })
      .onChange(val => {
        if (val === "") {
          mat.alphaMap = null;
        } else {
          mat.alphaMap = new TextureLoader().load(val);
        }
      });

    folder.open();

    const animationFolder = folder.addFolder("WavyAnimation");
    animationFolder.add(mat, "isAnimate");
    animationFolder.add(mat, "speed", -2, 2);
    animationFolder.add(mat, "waveFrequency", 0.0, 1.0);
    animationFolder.add(mat, "wavePow", 0.0, 4.0);
    animationFolder.add(mat, "direction", {
      horizontal: Directions.horizontal,
      vertical: Directions.vertical,
      radial: Directions.radial
    });
    animationFolder.add(mat, "raisedBottom", 0.0, 1.0);
    animationFolder.open();
  }

  static initSkyGUI(gui, sky, sunSphere) {
    const effectController = {
      turbidity: 10,
      rayleigh: 0.15,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
      inclination: 0.07, // elevation / inclination
      azimuth: 0.25, // Facing front,
      sun: !true
    };

    const distance = 400000;

    function guiChanged() {
      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = effectController.turbidity;
      uniforms["rayleigh"].value = effectController.rayleigh;
      uniforms["luminance"].value = effectController.luminance;
      uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
      const theta = Math.PI * (effectController.inclination - 0.5);
      const phi = 2 * Math.PI * (effectController.azimuth - 0.5);
      sunSphere.position.x = distance * Math.cos(phi);
      sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
      sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
      sunSphere.visible = effectController.sun;
      uniforms["sunPosition"].value.copy(sunSphere.position);
    }
    guiChanged();

    const folder = gui.addFolder("Sky");
    folder
      .add(effectController, "turbidity", 1.0, 20.0, 0.1)
      .onChange(guiChanged);
    folder
      .add(effectController, "rayleigh", 0.0, 4, 0.001)
      .onChange(guiChanged);
    folder
      .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
      .onChange(guiChanged);
    folder
      .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
      .onChange(guiChanged);
    folder.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
    folder
      .add(effectController, "inclination", 0, 1, 0.0001)
      .onChange(guiChanged);
    folder.add(effectController, "azimuth", 0, 1, 0.0001).onChange(guiChanged);
    folder.add(effectController, "sun").onChange(guiChanged);
    folder.open();
  }
}
