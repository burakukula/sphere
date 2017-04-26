const $face = document.querySelector('.face');
const $container = document.querySelector('.container');
const setCanvas = document.getElementById('canvas');
const radius = 20;
const width = 600;
const height = 600;


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
const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 100 );
camera.position.set(0, 0, 100);

// texture loader
const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);

// texture
const texture = loader.load('img/map-4-100.jpg');
const sphereGeo = new THREE.SphereGeometry (radius, 20, 200);
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
obj.position.z = radius;
sphere.add( obj );

// update matrix
sphere.updateMatrixWorld();
const position = new THREE.Vector3();

// update element position
const updatePosition = (el, x, y, z) => {
  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
}

const animate = () => {
	requestAnimationFrame( animate );
  sphere.rotation.y += 0.01;

  position.setFromMatrixPosition(obj.matrixWorld);
  xParam = position.x * (width/111);
  updatePosition($face, xParam , position.y, position.z);

  position.z < 0 ? $face.classList.add('hidden') : $face.classList.remove('hidden');

	renderer.render( scene, camera );

}

animate();
