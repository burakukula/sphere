const $face = document.getElementById('face');
const $face1 = document.getElementById('face1');

const WIDTH = 600;
const HEIGHT = 600;

const ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;

const container = document.querySelector('.container');
const setCanvas = document.getElementById('canvas');

const camera = new THREE.PerspectiveCamera(ANGLE, ASPECT, 1, 3000);
camera.position.set(200, 0, 0);
camera.lookAt(0, 0 , 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x1b2e57 );

const light = new THREE.HemisphereLight( 0xdbdbdb, 0x1b2e57, 2 );
scene.add( light );

const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);

const texture = loader.load('img/map-4-100.jpg');
const earthGeo = new THREE.SphereGeometry (40, 40, 400);
const earthMat = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  map: texture
});

const globe = new THREE.Mesh(earthGeo, earthMat);
globe.position.set(0, 0, 0);

// var face = new THREE.Object3D()
const face = new THREE.Mesh(earthGeo, earthMat);
face.scale.multiplyScalar(0.1);
face.position.set(0, 0, 0);

const face1 = new THREE.Mesh(earthGeo, earthMat);
face1.scale.multiplyScalar(0.1);
face1.position.set(0, 20, 0);


globe.add(face);
globe.add(face1);
scene.add(globe);
camera.lookAt( globe.position );

const renderer = new THREE.WebGLRenderer({antialias : true, canvas : setCanvas});
renderer.setSize(WIDTH, HEIGHT);
renderer.domElement.style.position = 'relative';

container.appendChild(renderer.domElement);

let radius = 20;
let angle = 0;
let speed = -0.8;
const clock = new THREE.Clock();

const updateDiv = (div, x, y, yyy) => {
  xA = Math.round(x) * 4;
  // y = Math.round(y) * 2;
  var scale = 1;
  div.style.transform = `translate(${300+xA}px, ${yyy}px) scale(${scale})`;
}

const render = () => {
  delta = clock.getDelta();
  if (delta) {
    globe.rotation.y += (delta * Math.PI / 180) * 10;
    // globe.rotation.y += speed * delta;

    angle += speed * delta;
    face.position.x = globe.position.x + radius * Math.cos( angle );
    face.position.z = globe.position.z + radius * Math.sin( angle );

    face1.position.x = globe.position.x + 40 * Math.cos( angle );
    face1.position.z = globe.position.z + 40 * Math.sin( angle );
    // camera.lookAt( globe.position );

    // face.position.x = globe.position.x + radius * Math.cos( angle );
    // face.position.z = globe.position.z + radius * Math.sin( angle );
    updateDiv($face, face.position.x, face.position.z, 300);
    updateDiv($face1, face1.position.x, face1.position.z, 220);
  }
  renderer.render(scene, camera);
  requestAnimationFrame( render );
}
render();
// setInterval(render, 500);
