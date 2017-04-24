var WIDTH = 600;
var HEIGHT = 600;

var angle = 45;
var aspect = WIDTH / HEIGHT;

var container = document.querySelector('.container');
var setCanvas = document.getElementById('canvas');

var camera = new THREE.PerspectiveCamera();
camera.position.set(0, 0, 0);
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x1b2e57 );

var light = new THREE.HemisphereLight( 0xdbdbdb, 0x1b2e57, 2 );
scene.add( light );

var loadingManager = new THREE.LoadingManager();
var loader = new THREE.TextureLoader(loadingManager);

var texture = loader.load('img/map-4-100.jpg');
// var bump = loader.load("img/map-5-100.jpg", myInit);
var earthGeo = new THREE.SphereGeometry (40, 40, 400);
var earthMat = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  map: texture
  // bumpMap: bump
});

var earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.position.set(-100, 0, 0);

scene.add(earthMesh);
camera.lookAt( earthMesh.position );

var renderer = new THREE.WebGLRenderer({antialias : true, canvas : setCanvas});
renderer.setSize(WIDTH, HEIGHT);
renderer.domElement.style.position = 'relative';

container.appendChild(renderer.domElement);

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

var toRadians = (angle) => {
    return angle * (Math.PI / 180);
};

var toDegrees = (angle) => {
    return angle * (180 / Math.PI);
};

var renderArea = renderer.domElement;

renderArea.addEventListener('mousedown', (e) => {
    isDragging = true;
});

renderArea.addEventListener('mousemove', (e) => {
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {

        let deltaRotationQuaternion = new THREE.Quaternion().
        setFromEuler(
            new THREE.Euler(toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ')
        );

        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});

document.addEventListener('mouseup', (e) => {
    isDragging = false;
});

function render () {
  requestAnimationFrame( render );
  earthMesh.rotation.y -= 0.001;
  renderer.render(scene, camera);
}

render();
