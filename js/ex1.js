var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

var angle = 45,
    aspect = WIDTH / HEIGHT,
    near = 0.1,
    far = 3000;

var container = document.getElementById('container');

var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
camera.position.set(0, 0, 0);
var scene = new THREE.Scene();

var light = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI / 2, 1);
light.position.set(4000, 4000, 1500);
light.target.position.set (1000, 3800, 1000);

scene.add(light);

var loadingManager = new THREE.LoadingManager();
var loader = new THREE.TextureLoader(loadingManager);



var texture = loader.load("img/earth_colored2.png", myInit);
console.log(texture);

var earthGeo = new THREE.SphereGeometry (30, 40, 400);
var earthMat = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  map: texture,
});

var earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.position.set(-100, 0, 0);


scene.add(earthMesh);
camera.lookAt( earthMesh.position );

var renderer = new THREE.WebGLRenderer({antialiasing : true});
renderer.setSize(WIDTH, HEIGHT);
renderer.domElement.style.position = 'relative';

container.appendChild(renderer.domElement);
function myInit(texture) {
  render();
}
function render () {
  // requestAnimationFrame( render );
  // earthMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
}

render();
