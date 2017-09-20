import {
  WebGLRenderer,
  TextureLoader,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Object3D,
  Vector3
} from 'three/build/three.module.js';

import calculationsHelper from './calculations_helper';
import {cameraZposition, radius, globeSegments, markerAboveSphere, sceneWidth} from './setup';
import {scene, camera} from './scene';

const STATUS_LOADING = 'loading';
const STATUS_LOADED = 'loaded';
const STATUS_READY = 'ready';
const ITEM_VISIBILITY_CLASS = 'brn-about-sphere__item--visible';
const BUBBLE_VISIBILITY_CLASS = 'brn-about-sphere__bubble--visible';

const START_DISTANCE = -300;
const ZOOM_IN_SPEED = 0.008;
const BASE_ROTATION_SPEED = 0.005;
const BUBBLE_VISIBILITY_Z = 8;
const MAX_MOMENTUM = 10;
const FRICTION = 0.05;
const SAND_MODE_CLICKS = 5;

const easeInElastic = t => (.04 - .04 / t) * Math.sin(9 * t) + 1;
const easeInOut = function(t) {
  return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

class Sphere {

  constructor({canvas, container}) {
    this.canvas = canvas;
    this.container = container;
    this.rotationSpeed = BASE_ROTATION_SPEED;
    this.renderer = new WebGLRenderer({antialias: true, canvas: this.canvas});
    this.textureIMG = './img/sphere-map-small.jpg';
    this.status = STATUS_LOADING;
    this.manualMoving = false;
    this.suspended = false;
    this.helperVector = new Vector3();
    this.zoomInTime = 0;
    this.momentum = 0;
    this.lastXDelta = 0;

    this.init();
    this.rotate = this.rotate.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);

    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  enableSandMode() {
    const imgDir = './img/sand';
    const textureImg = `${imgDir}/map-final.jpg`;

    const loader = new TextureLoader();
    const texture = loader.load(textureImg, () => {
      this.sphere.material = new MeshPhongMaterial({color: 0xaaaaaa, map: texture});
    });

    const $avatars = Array.from(this.container.querySelectorAll('.js-sphere-item-avatar'));

    $avatars.forEach($avatar => {
      $avatar.src = `${imgDir}/avatar-${Math.round(Math.random() * 3) + 1}.png`;
    });
  }

  init() {
    // texture
    const loader = new TextureLoader();
    const texture = loader.load(this.textureIMG, () => {
      this.sphere.material = new MeshPhongMaterial({color: 0xaaaaaa, map: texture});
      this.status = STATUS_LOADED;
      requestAnimationFrame(this.zoomIn);
    });

    // sphere
    const sphereGeo = new SphereGeometry(radius, globeSegments, globeSegments);

    this.sphere = new Mesh(sphereGeo);
    this.sphere.position.set(0, 0, START_DISTANCE);

    scene.add(this.sphere);
    camera.lookAt(this.sphere.position);
  }

  rotate() {
    if (this.suspended || this.status !== STATUS_READY) {
      return;
    }

    if (!this.manualMoving) {
      this.sphere.rotation.y += this.rotationSpeed * (1 + this.momentum);

      if (this.momentum < -FRICTION) {
        this.momentum += FRICTION;
      } else if (this.momentum > FRICTION) {
        this.momentum -= FRICTION;
      } else {
        this.momentum = 0;
      }
    }

    this.renderer.render(scene, camera);

    this.points.forEach(({el, bubble, obj}) => {
      this.helperVector.setFromMatrixPosition(obj.matrixWorld);
      this.updateMarkerPosition(el, bubble, this.helperVector.x, -this.helperVector.y, this.helperVector.z);
    });

    requestAnimationFrame(this.rotate);
  }

  zoomIn() {
    if (this.suspended || this.status !== STATUS_LOADED) {
      return;
    }

    this.zoomInTime += ZOOM_IN_SPEED;

    this.sphere.position.z = START_DISTANCE - easeInElastic(this.zoomInTime) * START_DISTANCE;
    this.sphere.rotation.y += BASE_ROTATION_SPEED * (1 + 50 * (1 - easeInOut(this.zoomInTime)));

    this.renderer.render(scene, camera);

    if (this.zoomInTime >= 1) {
      this.sphere.position.z = 0;
      this.status = STATUS_READY;

      this.initMarkers();
      this.initListeners();

      requestAnimationFrame(this.rotate);
    } else {
      requestAnimationFrame(this.zoomIn);
    }
  }

  stopAnimation() {
    this.suspended = true;
  }

  startAnimation() {
    if (this.suspended) {
      console.log('sus?');
      this.suspended = false;

      if (this.status === STATUS_READY) {
        this.rotate();
      } else if (this.status === STATUS_LOADED) {
        this.zoomIn();
      }
    }
  }

  initListeners() {
    const renderArea = this.renderer.domElement;

    this.pointerLastPosition = {
      x: 0,
      y: 0
    };

    renderArea.addEventListener('mousedown', e => {
      this.manualMoving = true;
      this.lastXDelta = 0;
      this.pointerLastPosition = {
        x: e.screenX,
        y: e.screenY
      };
    });

    renderArea.addEventListener('touchstart', e => {
      this.manualMoving = true;
      this.firstSwipe = true;
      this.lastXDelta = 0;
      this.pointerLastPosition = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    });

    window.addEventListener('mouseup', this.cancelManualRotation.bind(this));
    window.addEventListener('touchend', this.cancelManualRotation.bind(this));
    window.addEventListener('touchcancel', this.cancelManualRotation.bind(this));
    window.addEventListener('mousemove', this.handleManualRotation.bind(this));
    window.addEventListener('touchmove', this.handleManualRotation.bind(this));

    let clicks = 0;
    let clickTimeout = null;

    this.canvas.addEventListener('click', () => {
      if (clicks === SAND_MODE_CLICKS) {
        this.enableSandMode();
      }

      clicks++;

      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => clicks = 0, 300);
    });
  }

  cancelManualRotation() {
    if (this.manualMoving) {
      const force = Math.min(Math.abs(this.lastXDelta) / (this.size / 8), 1);

      this.momentum = MAX_MOMENTUM * Math.sign(this.lastXDelta) * force;
    }

    this.manualMoving = false;
  }

  // update element position
  updateMarkerPosition(el, bubble, x, y, z) {
    let visible = el.classList.contains(ITEM_VISIBILITY_CLASS);

    if (z > 0 && !visible) {
      el.classList.add(ITEM_VISIBILITY_CLASS);
      visible = true;
    } else if (z <= 0 && visible) {
      el.classList.remove(ITEM_VISIBILITY_CLASS);
      visible = false;
    }

    if (visible) {
      const bubbleVisible = bubble.classList.contains(BUBBLE_VISIBILITY_CLASS);

      if (z > BUBBLE_VISIBILITY_Z && !bubbleVisible) {
        bubble.classList.add(BUBBLE_VISIBILITY_CLASS);
      } else if (z <= BUBBLE_VISIBILITY_Z && bubbleVisible) {
        bubble.classList.remove(BUBBLE_VISIBILITY_CLASS);
      }

      el.style.transform = `translate3d(${x * this.unit}px, ${y * this.unit}px, ${z * this.unit}px)`;
      el.style.zIndex = Math.floor(z);
    }
  }

  initMarkers() {
    const $points = Array.from(this.container.querySelectorAll('.js-sphere-item'));

    this.points = $points.map(el => {
      const y = parseInt(el.getAttribute('data-y'), 10);
      const angle = parseInt(el.getAttribute('data-angle'), 10);
      const obj = new Object3D();
      const bubble = el.querySelector('.js-sphere-item-bubble');

      obj.position.copy(calculationsHelper.getPosition(y, angle, radius + markerAboveSphere));
      this.sphere.add(obj);

      return {
        el,
        bubble,
        obj
      };
    });
  }

  handleManualRotation(e) {
    if (!this.manualMoving) {
      return;
    }

    const touch = e.changedTouches;
    const newPosition = {
      x: touch ? e.changedTouches[0].clientX : e.screenX,
      y: touch ? e.changedTouches[0].clientY : e.screenY
    };

    const moveDelta = {
      x: newPosition.x - this.pointerLastPosition.x,
      y: newPosition.y - this.pointerLastPosition.y
    };

    if (touch && this.firstSwipe) {
      // if first swipe was along Y axis we assume user wants to scroll instead of rotating the sphere
      if (Math.abs(moveDelta.y) > Math.abs(moveDelta.x)) {
        this.manualMoving = false;
        return;
      }

      this.firstSwipe = false;
    }

    this.sphere.rotation.y += moveDelta.x / this.size;

    this.lastXDelta = moveDelta.x;
    this.pointerLastPosition = newPosition;
  }

  onResize() {
    this.size = this.canvas.parentNode.getBoundingClientRect().width;
    this.unit = this.size / sceneWidth;
    this.container.style.perspective = cameraZposition * this.unit + 'px';

    this.renderer.setSize(this.size, this.size);
    this.renderer.render(scene, camera);
  }

}

export default Sphere;
