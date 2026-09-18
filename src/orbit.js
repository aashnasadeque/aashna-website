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
    group.position.y = .12;
    scene.add(group);
    const pearl = new THREE.MeshPhysicalMaterial({ color: 0xc8b9eb, metalness: .25, roughness: .24, clearcoat: 1 });
    const accentMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf1a9ad, metalness: .2, roughness: .24, clearcoat: 1 });
    const threadMaterial = new THREE.MeshBasicMaterial({ color: 0xe8d2f6, transparent: true, opacity: .48 });
    const path = (points, radius, material) => {
      const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, radius, 10, false), material);
      group.add(mesh);
      return mesh;
    };

    // A and S are dimensional strokes, joined by a lighter thread.
    path([[-2.3, -1.65, .1], [-1.98, -.9, .15], [-1.5, .35, .25], [-1.08, 1.55, .05], [-.7, .35, -.1], [-.28, -.9, .05], [0, -1.65, .16]], .11, pearl);
    path([[-1.88, -.52, .3], [-1.42, -.5, .38], [-.75, -.52, .3]], .085, pearl);
    path([[2.15, 1.32, .12], [1.42, 1.64, .27], [.59, 1.31, .32], [.4, .61, .41], [.83, .12, .48], [1.58, -.25, .38], [1.91, -.94, .22], [1.52, -1.5, .13], [.7, -1.57, .22], [.18, -1.26, .35]], .12, accentMaterial);
    path([[-2.78, .5, -.65], [-2.18, 1.8, -.7], [-.52, 1.94, -.8], [.35, .94, -.72], [1.73, .78, -.8], [2.62, -.02, -.65], [1.99, -1.78, -.66], [.24, -1.92, -.7], [-1.29, -1.33, -.62], [-2.78, .5, -.65]], .024, threadMaterial);
    path([[-2.63, -.7, -.35], [-1.68, -.12, -.48], [-.45, -.23, -.42], [.65, -.85, -.43], [1.74, -.58, -.44], [2.48, .1, -.38]], .018, threadMaterial);

    const nodePositions = [
      [-2.58, .48, .55], [-1.72, -1.24, .66], [-.25, 1.56, .42],
      [.54, -.55, .65], [2.2, .81, .52], [1.95, -1.35, .45],
    ];
    const nodes = interests.map((interest, index) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 20), new THREE.MeshStandardMaterial({ color: interest.color, emissive: interest.color, emissiveIntensity: .24, roughness: .18 }));
      node.position.set(...nodePositions[index]);
      node.userData.index = index;
      group.add(node);
      return node;
    });
    const sparksGeometry = new THREE.BufferGeometry();
    const sparks = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      sparks[i * 3] = (Math.random() - .5) * 8;
      sparks[i * 3 + 1] = (Math.random() - .5) * 7;
      sparks[i * 3 + 2] = (Math.random() - .5) * 3 - 1;
    }
    sparksGeometry.setAttribute('position', new THREE.BufferAttribute(sparks, 3));
    scene.add(new THREE.Points(sparksGeometry, new THREE.PointsMaterial({ color: 0xc4b6dc, size: .02, transparent: true, opacity: .55 })));

    updateScene = (index) => {
      const target = new THREE.Color(interests[index].color);
      if (reducedMotion) accentMaterial.color.copy(target);
      else gsap.to(accentMaterial.color, { r: target.r, g: target.g, b: target.b, duration: .5, overwrite: true });
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
      group.scale.setScalar(width < 520 ? .72 : .93);
      renderer.render(scene, camera);
    }
    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      if (!drag.active) {
        group.rotation.y += (Math.sin(t * .45) * .18 - group.rotation.y) * .012;
        group.rotation.x += (Math.sin(t * .35) * .06 - group.rotation.x) * .012;
      }
      group.position.y = .12 + Math.sin(t * .7) * .06;
      renderer.render(scene, camera);
    }
    if (!reducedMotion) {
      let inView = true;
      const syncLoop = () => renderer.setAnimationLoop(!document.hidden && inView ? tick : null);
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncLoop();
      }, { threshold: .01 });
      observer.observe(visual);
      document.addEventListener('visibilitychange', syncLoop);
      syncLoop();
    }
  } catch (error) {
    console.warn('3D scene unavailable; showing static artwork.', error);
  }
}
