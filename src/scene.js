import {Scene, Color, AmbientLight, PerspectiveCamera} from 'three/build/three.module.js';

import {cameraZposition, cameraDeg} from './setup';

export const scene = new Scene();
scene.background = new Color(0x1b2e57);

export const ambientLight = new AmbientLight(0xffffff);
ambientLight.intensity = 1.44;
scene.add(ambientLight);

export const camera = new PerspectiveCamera(cameraDeg, 1, 1, 300);
camera.position.set(0, 0, cameraZposition);
