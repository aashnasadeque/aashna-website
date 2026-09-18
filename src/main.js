import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';
import './interactive.css';

document.querySelector('#year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.project-toggle').forEach((button) => {
  const card = button.closest('.project-card');
  const detail = card.querySelector('.project-detail');
  const sync = () => {
    const expanded = card.classList.contains('is-open') || card.classList.contains('is-hovered');
    button.setAttribute('aria-expanded', String(expanded));
    button.firstChild.textContent = expanded ? 'Less details ' : 'More details ';
    detail.inert = !expanded;
  };
  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    card.classList.add('is-hovered');
    sync();
  });
  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-hovered');
    sync();
  });
  button.addEventListener('click', () => {
    if (card.classList.contains('is-hovered') && !card.classList.contains('is-open')) {
      card.classList.remove('is-hovered');
    } else {
      card.classList.toggle('is-open');
    }
    card.classList.remove('is-hovered');
    sync();
  });
  sync();
});

if (!reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.eyebrow', { y: 18, opacity: 0, duration: .55 })
    .from('.hero h1', { y: 34, opacity: 0, duration: .8 }, '-=.25')
    .from('.hero-description, .hero-actions', { y: 22, opacity: 0, duration: .6, stagger: .12 }, '-=.35');
  gsap.utils.toArray('.project-card, .about-layout, .timeline-item').forEach((element) => {
    gsap.from(element, { y: 34, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });
}

const container = document.querySelector('#scene');
try {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, 0, 9.2);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);
  container.parentElement.classList.add('has-scene');

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const key = new THREE.PointLight(0xffd4c5, 85, 30); key.position.set(-3, 4, 7); scene.add(key);
  const fill = new THREE.PointLight(0x9c85ff, 75, 30); fill.position.set(5, -3, 5); scene.add(fill);

  const group = new THREE.Group(); scene.add(group);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.73, 5), new THREE.MeshPhysicalMaterial({ color: 0xb29ae5, metalness: .22, roughness: .17, clearcoat: 1, clearcoatRoughness: .1, flatShading: true }));
  group.add(core);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.78, 2), new THREE.MeshBasicMaterial({ color: 0xf2dcff, wireframe: true, transparent: true, opacity: .12 })); group.add(wire);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xf6c9c5, metalness: .55, roughness: .22, side: THREE.DoubleSide });
  const orbitOne = new THREE.Mesh(new THREE.TorusGeometry(2.55, .045, 12, 180), torusMaterial); orbitOne.rotation.set(.35, .4, .16); group.add(orbitOne);
  const orbitTwo = new THREE.Mesh(new THREE.TorusGeometry(2.18, .018, 8, 160), new THREE.MeshBasicMaterial({ color: 0xd5ccff, transparent: true, opacity: .55 })); orbitTwo.rotation.set(1.3, .15, -.3); group.add(orbitTwo);
  const nodes = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const node = new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? .11 : .065, 16, 16), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xe7ff9d : 0xffb0a4, emissive: i % 2 ? 0x879c50 : 0x8b4c54, emissiveIntensity: .5 }));
    node.position.set(Math.cos(angle) * 2.55, Math.sin(angle) * 2.2, Math.sin(angle * 2) * .7); group.add(node); nodes.push(node);
  }
  const starsGeometry = new THREE.BufferGeometry();
  const stars = new Float32Array(210 * 3);
  for (let i = 0; i < 210; i++) { stars[i * 3] = (Math.random() - .5) * 10; stars[i * 3 + 1] = (Math.random() - .5) * 10; stars[i * 3 + 2] = (Math.random() - .5) * 5 - 1; }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
  const particles = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xd9cafd, size: .024, transparent: true, opacity: .7 })); scene.add(particles);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => { const rect = container.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width - .5) * 2; pointer.y = ((event.clientY - rect.top) / rect.height - .5) * 2; };
  container.addEventListener('pointermove', onPointerMove);
  const resize = () => { const { width, height } = container.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); group.scale.setScalar(width < 500 ? .82 : 1); };
  window.addEventListener('resize', resize); resize();
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => { const t = clock.getElapsedTime(); if (!reducedMotion) { group.rotation.y += .0025; group.rotation.x += (pointer.y * .15 - group.rotation.x) * .025; group.rotation.z += (pointer.x * .12 - group.rotation.z) * .025; group.position.y = Math.sin(t * .8) * .12; orbitTwo.rotation.z += .0018; particles.rotation.y += .0002; } renderer.render(scene, camera); });
  document.addEventListener('visibilitychange', () => { renderer.setAnimationLoop(document.hidden ? null : () => { const t = clock.getElapsedTime(); if (!reducedMotion) { group.rotation.y += .0025; group.rotation.x += (pointer.y * .15 - group.rotation.x) * .025; group.rotation.z += (pointer.x * .12 - group.rotation.z) * .025; group.position.y = Math.sin(t * .8) * .12; orbitTwo.rotation.z += .0018; } renderer.render(scene, camera); }); });
} catch (error) {
  console.warn('3D scene unavailable; showing static artwork.', error);
}
