const $face = document.querySelector('.js-f1');
const $face2 = document.querySelector('.js-f2');
const $face3 = document.querySelector('.js-f3');
const $container = document.querySelector('.container');
const setCanvas = document.getElementById('canvas');
const radius = 20;
const width = 600;
const height = 600;

const cameraZposition = 80;
const cameraDeg = 45;
const cameraDegRad = (2 * Math.PI) * cameraDeg/360;

const sceneWidth = (2 * cameraZposition) * Math.tan(cameraDegRad/2);
const units = width/sceneWidth;

$container.style.perspective = 100 * units + 'px';

// renderer
const renderer = new THREE.WebGLRenderer({antialias : true, canvas : setCanvas});
renderer.setSize(width, height);
renderer.domElement.style.position = 'relative';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x1b2e57 );

// light
const light = new THREE.HemisphereLight( 0xdbdbdb, 0x1c2f56, 2);
scene.add( light );

// camera
const camera = new THREE.PerspectiveCamera( cameraDeg, width / height, 1, 200 );
camera.position.set(0, 0, cameraZposition);

// texture loader
const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);

// texture
const texture = loader.load('img/map-4-100.jpg');
const sphereGeo = new THREE.SphereGeometry (radius, 200, 200);
const sphereMat = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  map: texture
});

// sphere
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(0, 0, 0);
scene.add(sphere);
camera.lookAt( sphere.position );

const toRadians = (angle) => {
  return angle * (Math.PI / 180);
};

const getPosition = (y, angle) => {
  const z = Math.sqrt((radius * radius) - (y * y));
  const x = 0;

  let quaternionThree = new THREE.Quaternion()
    .setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), toRadians(angle)
    );

  const vectorProto = new THREE.Vector3( x, y, z );
  vectorProto.applyQuaternion(quaternionThree);
  return vectorProto;
}

// object
const obj = new THREE.Object3D();
const obj2 = new THREE.Object3D();
const obj3 = new THREE.Object3D();

obj.position.copy(getPosition(10, 5));
obj2.position.copy(getPosition(18, 45));
obj3.position.copy(getPosition(-10, 105));

sphere.add( obj );
sphere.add( obj2 );
sphere.add( obj3 );

const points = [
  {
    obj: obj,
    el: $face
  }, {
    obj: obj2,
    el: $face2
  }, {
    obj: obj3,
    el: $face3
  }
]

// update matrix
sphere.updateMatrixWorld();
const pos = new THREE.Vector3();

// update element position
const updatePosition = (el, x, y, z) => {
  let scale;
  if (z < 0) {
    scale = 0;
  } else if (z > 0 && z < 8) {
    scale = z/100;
  } else {
    scale = 1
  }

  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
}

const renderArea = renderer.domElement;

// mouse events
let moving = false;
let startPoint = {
    x: 0,
    y: 0
};

const moveIt = (e) => {
  let deltaMove = {
    x: e.offsetX-startPoint.x
  };

  if (moving) {
    let quaternionThree = new THREE.Quaternion()
      .setFromEuler(
        new THREE.Euler(0, toRadians(deltaMove.x * 1), 0, 'YXZ')
      );
    sphere.quaternion.multiplyQuaternions(quaternionThree, sphere.quaternion);
  }

  startPoint = {
      x: e.offsetX,
      y: e.offsetY
  };
}

renderArea.addEventListener('mousedown', (e) => {
    moving = true;
});

renderArea.addEventListener('mousemove', (e) => {
    moveIt(e);
});

window.addEventListener('mouseup', (e) => {
  moving = false;
});

window.addEventListener('touchstart', (e) => {
  moving = true;
});

window.addEventListener('touchmove', (e) => {
  moving = true;
  let deltaMove = {
      x: e.changedTouches[0].clientX - startPoint.x,
      y: e.changedTouches[0].clientY - startPoint.y
  };

  if (moving) {
      let quaternionThree = new THREE.Quaternion().
      setFromEuler(
          new THREE.Euler(0, toRadians(deltaMove.x * 1), 0, 'YXZ')
      );
      sphere.quaternion.multiplyQuaternions(quaternionThree, sphere.quaternion);
  }

  startPoint = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
  };
});

document.addEventListener('touchend', (e) => {
  moving = false;
});

const animate = () => {
	requestAnimationFrame( animate );
  sphere.rotation.y += 0.005;

  points.forEach(({el, obj}) => {
    pos.setFromMatrixPosition(obj.matrixWorld);
    updatePosition(el, pos.x * units, pos.y * units, pos.z * units);
    pos.z < 0 ? el.classList.add('hidden') : el.classList.remove('hidden');
  });

	renderer.render( scene, camera );

}

animate();
