var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspectRatio, 0.1, 10000);
camera.position.z = 10;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

document.body.appendChild(renderer.domElement);

var group = new THREE.Object3D();

//Setup the light
scene.add(new THREE.AmbientLight(0xEEEEEE));
var light = new THREE.SpotLight(0xFFFFFF, 0.5, 0, Math.PI / 2, 1);
light.position.set(1000, 3000, 1000);
light.target.position.set (2000, 3800, 1000);
scene.add(light);

THREE.ImageUtils.crossOrigin = '';

var geometry = new THREE.SphereGeometry(2, 300, 300);
var texture = THREE.ImageUtils.loadTexture("img/earth_colored2.png");

var material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x333333,
    map: texture,
    bumpScale: 0.2,
    shininess: 10
});

var earth = new THREE.Mesh(geometry, material);
earth.rotation.z = 23.439281 * Math.PI / 180;
group.add(earth);
scene.add(group);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
