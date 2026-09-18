import * as THREE from 'three';
import gsap from 'gsap';

const interests = [
  { title: 'Data & AI', description: 'Finding the story inside the numbers, then making it useful.', color: '#ad94df' },
  { title: 'Movement', description: 'Teaching group fitness and finding energy in community.', color: '#f59c91' },
  { title: 'Fashion', description: 'Playing with style, colour, and a wardrobe of possibilities.', color: '#e3b2d4' },
  { title: 'Baking', description: 'Creating custom cakes where flavour meets visual design.', color: '#e8c286' },
  { title: 'Hardware', description: 'Learning by building, one Raspberry Pi experiment at a time.', color: '#a8d4bb' },
  { title: 'Community', description: 'Making more room for women in engineering and tech.', color: '#c8c9ee' },
];

export function initOrbit({ reducedMotion }) {
  const container = document.querySelector('#scene');
  const visual = container.closest('.hero-visual');
  const buttons = [...document.querySelectorAll('.interest-button')];
  const title = document.querySelector('#interest-title');
  const description = document.querySelector('#interest-description');
  const number = document.querySelector('#interest-number');
  let updateScene = () => {};

  function selectInterest(index) {
    const interest = interests[index];
    title.textContent = interest.title;
    description.textContent = interest.description;
    number.textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    visual.style.setProperty('--interest-color', interest.color);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    updateScene(index);
  }

  buttons.forEach((button) => button.addEventListener('click', () => selectInterest(Number(button.dataset.interest))));
  selectInterest(0);

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.z = 9.2;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    visual.classList.add('has-scene');

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.PointLight(0xffdccf, 82, 30); key.position.set(-3, 4, 7); scene.add(key);
    const fill = new THREE.PointLight(0x8f72db, 62, 30); fill.position.set(5, -3, 5); scene.add(fill);

    const group = new THREE.Group();
    group.position.y = .28;
    scene.add(group);
    const coreMaterial = new THREE.MeshPhysicalMaterial({ color: interests[0].color, metalness: .17, roughness: .22, clearcoat: 1, clearcoatRoughness: .12, flatShading: true });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.52, 3), coreMaterial);
    group.add(core);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.56, 2), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: .14 }));
    group.add(wire);
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.36, .037, 10, 160), new THREE.MeshStandardMaterial({ color: 0xe5a9a5, metalness: .3, roughness: .3 }));
    orbit.rotation.set(.32, .3, .12); group.add(orbit);
    const secondOrbit = new THREE.Mesh(new THREE.TorusGeometry(2.06, .012, 6, 140), new THREE.MeshBasicMaterial({ color: 0x8779a9, transparent: true, opacity: .5 }));
    secondOrbit.rotation.set(1.35, .15, -.23); group.add(secondOrbit);

    const nodes = interests.map((interest, index) => {
      const angle = (index / interests.length) * Math.PI * 2 + .3;
      const node = new THREE.Mesh(new THREE.SphereGeometry(.21, 20, 20), new THREE.MeshStandardMaterial({ color: interest.color, emissive: interest.color, emissiveIntensity: .28, roughness: .2 }));
      node.position.set(Math.cos(angle) * 2.55, Math.sin(angle) * 2.12, Math.sin(angle * 2) * .75);
      node.userData.index = index;
      group.add(node);
      return node;
    });
    const starsGeometry = new THREE.BufferGeometry();
    const stars = new Float32Array(135 * 3);
    for (let i = 0; i < 135; i++) {
      stars[i * 3] = (Math.random() - .5) * 9;
      stars[i * 3 + 1] = (Math.random() - .5) * 9;
      stars[i * 3 + 2] = (Math.random() - .5) * 4 - 1;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x937cab, size: .025, transparent: true, opacity: .6 })));

    updateScene = (index) => {
      const target = new THREE.Color(interests[index].color);
      if (reducedMotion) coreMaterial.color.copy(target);
      else gsap.to(coreMaterial.color, { r: target.r, g: target.g, b: target.b, duration: .5, overwrite: true });
      nodes.forEach((node, i) => {
        const scale = i === index ? 1.45 : 1;
        if (reducedMotion) node.scale.setScalar(scale);
        else gsap.to(node.scale, { x: scale, y: scale, z: scale, duration: .35, overwrite: true });
      });
      if (reducedMotion) renderer.render(scene, camera);
    };
    updateScene(0);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const drag = { active: false, moved: 0, x: 0, y: 0 };
    function hitTest(event) {
      const rect = container.getBoundingClientRect();
      mouse.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(nodes)[0]?.object;
    }
    container.addEventListener('pointerdown', (event) => {
      drag.active = true; drag.moved = 0; drag.x = event.clientX; drag.y = event.clientY;
      container.setPointerCapture(event.pointerId);
    });
    container.addEventListener('pointermove', (event) => {
      if (drag.active && !reducedMotion) {
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        group.rotation.y += dx * .005;
        group.rotation.x += dy * .005;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        drag.x = event.clientX; drag.y = event.clientY;
      }
      container.style.cursor = drag.active ? 'grabbing' : hitTest(event) ? 'pointer' : 'grab';
    });
    container.addEventListener('pointerup', (event) => {
      if (drag.moved < 8) {
        const hit = hitTest(event);
        if (hit) selectInterest(hit.userData.index);
      }
      drag.active = false;
      container.style.cursor = 'grab';
    });
    container.addEventListener('pointercancel', () => { drag.active = false; });

    function resize() {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.scale.setScalar(width < 520 ? .77 : .95);
      renderer.render(scene, camera);
    }
    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      if (!drag.active) group.rotation.y += .0017;
      group.position.y = .28 + Math.sin(t * .7) * .07;
      secondOrbit.rotation.z += .001;
      renderer.render(scene, camera);
    }
    if (!reducedMotion) renderer.setAnimationLoop(tick);
    document.addEventListener('visibilitychange', () => {
      if (reducedMotion) return;
      renderer.setAnimationLoop(document.hidden ? null : tick);
    });
  } catch (error) {
    console.warn('3D scene unavailable; showing static artwork.', error);
  }
}
