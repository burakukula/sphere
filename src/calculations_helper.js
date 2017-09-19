import {Vector3} from 'three/build/three.module.js';

const PI180 = Math.PI / 180;
const Y_VECTOR = new Vector3(0, 1, 0);

function toRadians(angle) {
  return angle * PI180;
}

function getPosition(y, angle, radius) {
  const z = Math.sqrt((radius * radius) - (y * y));
  const x = 0;

  const vectorProto = new Vector3(x, y, z);

  vectorProto.applyAxisAngle(Y_VECTOR, toRadians(angle));
  return vectorProto;
}

export default {
  toRadians,
  getPosition
};
