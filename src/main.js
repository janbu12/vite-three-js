import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { gsap } from 'gsap';

// Ambil elemen canvas
const canvas = document.getElementById('canvas');

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#161A30");

// 2. Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Object
const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
loader.load( '../public/model/stylized_face.glb', function ( gltf ) {

      const model = gltf.scene;
      model.position.set( 0, -0.8, 0 );
      model.scale.set( 0.3, 0.3, 0.3 );
      scene.add( model );
    }, undefined, function ( e ) {

      console.error( e );

    } );
// 4. Light

const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#FFFFFF", 3);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
function resizeRendererToDisplaySize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Perbarui ukuran renderer jika ukuran canvas berubah
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false); // false untuk menghindari penghapusan konten canvas
    camera.aspect = width / height; // Perbarui aspek rasio kamera
    camera.updateProjectionMatrix(); // Terapkan perubahan pada kamera
  }
}

// 6. Control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = true;

controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

// 7. Animation
function animate() {
  requestAnimationFrame(animate);
  resizeRendererToDisplaySize();

  controls.update(); // Perbarui kontrol
  renderer.render(scene, camera); // Render scene
}
animate();

// 8. Event Listener untuk Resize
window.addEventListener('resize', () => {
  resizeRendererToDisplaySize();
});