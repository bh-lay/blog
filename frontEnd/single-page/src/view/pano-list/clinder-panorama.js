import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  MeshBasicMaterial,
  CylinderGeometry,
  Mesh,
} from 'three'

export default class ClinderPanorama {
  cameraFov = 43
  cylinderRadius = 10
  cylinderHeight = 8
  cylinderRadialSegments = 60
  cylinderHeightSegments = 2
  
  width = 1
  height = 1
  scene = null
  element = null
  camera = null
  renderer = null
  cylinder = null
  
  constructor(options) {
    this.element = options.element;
    this.updateSize();
    this.initWorld(options.panoramaUrl, () => {
      this.updateCameraAndRenderer()
      options.onInit && options.onInit()
    });
    this.updateCameraAndRenderer()
    this.animateStart();
    this.addEventListener();
  }
  initWorld(panoramaUrl, onLoadded) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      this.cameraFov,
      this.width / this.height,
      1,
      15
    );
    this.camera.position.set(0, 0, 0);
    this.renderer = new WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(this.width, this.height);

    this.element.appendChild(this.renderer.domElement);

    this.cylinder = this._createClinder(panoramaUrl, onLoadded)
    this.scene.add(this.cylinder);
  }
  _createClinder(panoramaUrl, onLoadded) {
    const textureLoader = new TextureLoader();
    // textureLoader.setCrossOrigin('anonymous');
    const texture = textureLoader.load(
      panoramaUrl,
      (texture) => {
        onLoadded && onLoadded()
      },
    );
    const material = new MeshBasicMaterial({
      map: texture,
      // wireframe: true,
    });

    const cylinderGeometry = new CylinderGeometry(
      this.cylinderRadius,
      this.cylinderRadius,
      this.cylinderHeight,
      this.cylinderRadialSegments,
      this.cylinderHeightSegments,
      true
    )
    // 反转内部面
    cylinderGeometry.scale(-1, 1, 1)
    
    return new Mesh(cylinderGeometry, material);
  }
  animateStart() {
    this.animateStop()
  
    let stopFlag = false;
    const startTime = Date.now();
    const startY = this.cylinder.rotation.y
    const animate = () => {
      if (stopFlag) {
        return
      }
      const now = Date.now();
      this.cylinder.rotation.y = startY + (now - startTime) / 29000;
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera); 
    }

    animate();
    this._stopAnimation = () => {
      stopFlag = true
    }
  }
  animateStop() {
    this._stopAnimation && this._stopAnimation();
  }
  updateSize() {
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
  }
  updateCameraAndRenderer() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera); 
  }
  handleResize() {
    if (this.element && this.camera && this.renderer) {
      this.updateSize();
      this.updateCameraAndRenderer()
    }
  }
  addEventListener() {
    this._resizeObserver = new ResizeObserver(this.handleResize.bind(this))
    this._resizeObserver.observe(this.element)
    this._intersectionobserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateStart()
      } else {
        this.animateStop()
      }
    }, {
      threshold: 0.5,
    })
    this._intersectionobserver.observe(this.element)
  }
  removeEventListener() {
    this._resizeObserver.unobserve(this.element)
    this._resizeObserver.disconnect()
    
    this._intersectionobserver.unobserve(this.element)
    this._intersectionobserver.disconnect()
  }
  destroy() {
    this.removeEventListener()
    this.animateStop()

    this.scene = null;
    this.element = null;
    this.camera = null;
    this.renderer = null;
    this.cylinder = null;
  }
}
