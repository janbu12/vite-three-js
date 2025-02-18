import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById('canvas');

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#161A30");

// 2. Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Object
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
let faceModel = null;

loader.load(
  '/model/stylized_face.glb',
  function (gltf) {
    faceModel = gltf.scene;
    faceModel.position.set(0, -0.8, 0);
    faceModel.scale.set(0.3, 0.3, 0.3);
    scene.add(faceModel);

    // Animasi rotasi berdasarkan scroll
    // gsap.to(faceModel.rotation, {
    //   y: Math.PI,
    //   scrollTrigger: {
    //     trigger: "body",
    //     start: "top top",
    //     end: "bottom bottom",
    //     scrub: 1, // Animasi mengikuti scroll
    //   }
    // });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    
    tl.to(faceModel.position, { x: -1.5, ease: "linear" }) // Geser ke kiri di content 2
      .to(faceModel.rotation, { y: Math.PI / 2, ease: "power2.inOut" }, "<") // Rotasi bersamaan
      .to(faceModel.position, { x: 1.5, ease: "linear" }) // Geser ke kanan di content 3
      .to(faceModel.rotation, { y: - Math.PI / 2, ease: "power2.inOut" }, "<");

    
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

// 4. Light
const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#FFFFFF", 3);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 6. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
