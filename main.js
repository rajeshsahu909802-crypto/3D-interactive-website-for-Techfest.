import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x071310, 0.045);
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.2, 8.2);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const world = new THREE.Group();
scene.add(world);
const sculpture = new THREE.Group();
world.add(sculpture);
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), new THREE.MeshStandardMaterial({ color: 0xff6a3d, roughness: 0.22, metalness: 0.4, emissive: 0x42190e, emissiveIntensity: 0.5 }));
sculpture.add(core);
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4 + i * 0.28, 0.014 + i * 0.008, 10, 128), new THREE.MeshBasicMaterial({ color: i === 1 ? 0xc9f35b : 0x85a79c, transparent: true, opacity: 0.84 }));
  ring.rotation.set(i * 0.72, i * 1.13, i * 0.38);
  ring.userData.speed = (i % 2 ? -1 : 1) * (0.11 + i * 0.035);
  sculpture.add(ring);
}
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(900 * 3);
for (let i = 0; i < 900; i++) { const radius = 3 + Math.random() * 13; const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); starPositions[i * 3 + 1] = radius * Math.cos(phi); starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta); }
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
world.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xd1f1bd, size: 0.018, transparent: true, opacity: 0.62 })));
const grid = new THREE.GridHelper(30, 30, 0x427568, 0x163c33);
grid.position.y = -2.35; grid.material.transparent = true; grid.material.opacity = 0.24; world.add(grid);
scene.add(new THREE.AmbientLight(0x94c2b2, 1.2));
const keyLight = new THREE.PointLight(0xff6a3d, 32, 12); keyLight.position.set(2, 2, 4); scene.add(keyLight);
const greenLight = new THREE.PointLight(0xc9f35b, 18, 10); greenLight.position.set(-4, -2, 2); scene.add(greenLight);

let targetX = 0, targetY = 0, scrollProgress = 0;
addEventListener('pointermove', (event) => { targetX = (event.clientX / innerWidth - 0.5) * 0.7; targetY = (event.clientY / innerHeight - 0.5) * 0.35; });
addEventListener('scroll', () => { scrollProgress = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); document.querySelector('.progress span').style.transform = `scaleY(${scrollProgress})`; });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
const clock = new THREE.Clock();
function render() { const t = clock.getElapsedTime(); sculpture.rotation.y += 0.0024; sculpture.rotation.x = Math.sin(t * 0.35) * 0.12; sculpture.position.y = Math.sin(t * 0.8) * 0.08 - scrollProgress * 0.4; world.rotation.y += (targetX - world.rotation.y) * 0.025; world.rotation.x += (-targetY - world.rotation.x) * 0.025; camera.position.z += (8.2 + scrollProgress * 2.2 - camera.position.z) * 0.025; camera.position.x += (targetX * 0.65 - camera.position.x) * 0.02; keyLight.position.x = 2 + Math.sin(t) * 1.5; renderer.render(scene, camera); requestAnimationFrame(render); }
render();

document.querySelectorAll('.track-card').forEach((card) => card.addEventListener('click', () => { document.querySelectorAll('.track-card').forEach((item) => item.classList.remove('active')); card.classList.add('active'); }));
