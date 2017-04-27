const $face = document.querySelector('.js-f1');
const $face2 = document.querySelector('.js-f2');
const $face3 = document.querySelector('.js-f3');
const $container = document.querySelector('.container');
const setCanvas = document.getElementById('canvas');
const radius = 20;
const width = 600;
const height = 600;

const cameraZposition = 150;
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
const light = new THREE.HemisphereLight( 0xdbdbdb, 0x1b2e57, 2 );
scene.add( light );

// camera
const camera = new THREE.PerspectiveCamera( cameraDeg, width / height, 1, 200 );
// const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 5, 1000);
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

// object
const obj = new THREE.Object3D();
const obj2 = new THREE.Object3D();
const obj3 = new THREE.Object3D();
obj.position.z = radius;
obj2.position.y = 10;
obj2.position.z = 17.320;
obj3.position.y = -10;
obj3.position.z = 17.320;
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
// const position = new THREE.Vector3();

// update element position
const updatePosition = (el, x, y, z) => {
  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
}

const animate = () => {
	requestAnimationFrame( animate );
  sphere.rotation.y += 0.01;

  points.forEach(({el, obj}) => {
    let pos = new THREE.Vector3();
    pos.setFromMatrixPosition(obj.matrixWorld);
    updatePosition(el, pos.x * units, pos.y * units, pos.z * units);
    pos.z < 0 ? el.classList.add('hidden') : el.classList.remove('hidden');
  });

	renderer.render( scene, camera );

}

animate();
