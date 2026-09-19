import * as THREE from 'three';

const charmData = [
  { label: 'MOVEMENT', color: 0xb9638f },
  { label: 'TINY WHISK', color: 0xd58aa8 },
  { label: 'HARDWARE', color: 0x7d8fc4 },
  { label: 'FASHION', color: 0xae79b4 },
  { label: 'TRAVEL', color: 0x6f9aa8 },
  { label: 'AI + DATA', color: 0x8d70b4 },
];

const tube = (points, radius, material, closed = false) => {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), closed);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 40, radius, 8, closed), material);
};

export function initBracelet({ reducedMotion }) {
  const container = document.querySelector('#bracelet-scene');
  const label = document.querySelector('#bracelet-label');
  if (!container || !label) return;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, .15, 8.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff7fb, 0x8c6681, 2.3));
    const key = new THREE.DirectionalLight(0xffffff, 3.3);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const blush = new THREE.PointLight(0xf4a9c9, 28, 18);
    blush.position.set(4, -2, 4);
    scene.add(blush);

    const root = new THREE.Group();
    root.rotation.x = .7;
    root.rotation.z = -.12;
    scene.add(root);

    const metal = new THREE.MeshPhysicalMaterial({
      color: 0xd8b0c7,
      metalness: .72,
      roughness: .2,
      clearcoat: 1,
      clearcoatRoughness: .15,
    });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x9e6f8c, metalness: .76, roughness: .22 });
    const bracelet = new THREE.Mesh(new THREE.TorusGeometry(2.33, .105, 16, 120), metal);
    root.add(bracelet);

    const charmGroups = [];
    const hitTargets = [];
    const charmMaterial = (color) => new THREE.MeshPhysicalMaterial({ color, metalness: .3, roughness: .25, clearcoat: 1 });
    const mark = (object, index) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.userData.charmIndex = index;
          hitTargets.push(child);
        }
      });
    };

    charmData.forEach((item, index) => {
      const angle = -.2 - index * .53;
      const group = new THREE.Group();
      group.position.set(Math.cos(angle) * 2.33, Math.sin(angle) * 2.33, .03);
      group.rotation.z = angle - Math.PI / 2;
      const jumpRing = new THREE.Mesh(new THREE.TorusGeometry(.16, .035, 8, 24), darkMetal);
      jumpRing.position.y = -.12;
      group.add(jumpRing);
      const charm = new THREE.Group();
      charm.position.y = -.57;
      charm.rotation.z = -(angle - Math.PI / 2);
      group.add(charm);
      const material = charmMaterial(item.color);

      if (index === 0) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .56, 12), darkMetal);
        bar.rotation.z = Math.PI / 2;
        charm.add(bar);
        [-.32, .32].forEach((x) => {
          const weight = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .16, 16), material);
          weight.position.x = x;
          weight.rotation.z = Math.PI / 2;
          charm.add(weight);
        });
      } else if (index === 1) {
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(.055, .07, .38, 12), material);
        handle.position.y = .14;
        charm.add(handle);
        [-.1, 0, .1].forEach((x) => {
          const wire = tube([[0, -.02, 0], [x * 1.7, -.25, .02], [x, -.52, 0], [0, -.58, 0]], .018, darkMetal);
          charm.add(wire);
        });
      } else if (index === 2) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(.55, .55, .14), material);
        charm.add(chip);
        for (let pin = 0; pin < 4; pin++) {
          const offset = -.225 + pin * .15;
          for (const side of [-1, 1]) {
            const horizontal = new THREE.Mesh(new THREE.BoxGeometry(.12, .025, .025), darkMetal);
            horizontal.position.set(side * .335, offset, 0);
            charm.add(horizontal);
            const vertical = new THREE.Mesh(new THREE.BoxGeometry(.025, .12, .025), darkMetal);
            vertical.position.set(offset, side * .335, 0);
            charm.add(vertical);
          }
        }
      } else if (index === 3) {
        const hanger = tube([[-.34, -.16, 0], [0, .08, 0], [.34, -.16, 0], [-.34, -.16, 0]], .025, material, true);
        charm.add(hanger);
        const hook = tube([[0, .08, 0], [-.02, .26, 0], [.13, .3, 0]], .023, material);
        charm.add(hook);
      } else if (index === 4) {
        const globe = new THREE.Mesh(new THREE.SphereGeometry(.31, 20, 20), new THREE.MeshPhysicalMaterial({ color: item.color, transparent: true, opacity: .7, roughness: .2 }));
        charm.add(globe);
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(.32, .018, 8, 32), darkMetal);
        const ringB = ringA.clone();
        ringB.rotation.y = Math.PI / 2;
        charm.add(ringA, ringB);
      } else {
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.28, 1), material);
        charm.add(core);
        for (let node = 0; node < 3; node++) {
          const dot = new THREE.Mesh(new THREE.SphereGeometry(.065, 12, 12), darkMetal);
          const a = node * Math.PI * 2 / 3;
          dot.position.set(Math.cos(a) * .42, Math.sin(a) * .42, .04);
          charm.add(dot);
        }
      }

      mark(group, index);
      root.add(group);
      charmGroups.push(group);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const drag = { active: false, moved: 0, x: 0, y: 0 };
    let hovered = -1;

    const hitTest = (event) => {
      const bounds = container.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(hitTargets, false)[0]?.object.userData.charmIndex ?? -1;
    };

    const select = (index) => {
      if (hovered === index) return;
      hovered = index;
      label.textContent = index < 0 ? 'DRAG TO ROTATE · HOVER A CHARM' : charmData[index].label;
      charmGroups.forEach((group, charmIndex) => group.scale.setScalar(charmIndex === index ? 1.18 : 1));
    };

    container.addEventListener('pointerdown', (event) => {
      drag.active = true;
      drag.moved = 0;
      drag.x = event.clientX;
      drag.y = event.clientY;
      container.setPointerCapture(event.pointerId);
    });
    container.addEventListener('pointermove', (event) => {
      if (drag.active) {
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        root.rotation.y += dx * .008;
        root.rotation.x += dy * .006;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        drag.x = event.clientX;
        drag.y = event.clientY;
      } else {
        select(hitTest(event));
      }
    });
    const endDrag = () => { drag.active = false; };
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
    container.addEventListener('pointerleave', () => { if (!drag.active) select(-1); });

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      root.scale.setScalar(width < 400 ? .78 : .95);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    const tick = () => {
      const time = clock.getElapsedTime();
      if (!drag.active) root.rotation.y += .0022;
      charmGroups.forEach((group, index) => {
        group.children[1].rotation.y = Math.sin(time * .9 + index) * .13;
      });
      renderer.render(scene, camera);
    };

    if (!reducedMotion) {
      let visible = false;
      const sync = () => renderer.setAnimationLoop(visible && !document.hidden ? tick : null);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
      observer.observe(container);
      document.addEventListener('visibilitychange', sync);
    }
  } catch (error) {
    container.classList.add('bracelet-fallback');
    label.textContent = 'MOVEMENT · BAKING · HARDWARE · FASHION · TRAVEL · AI';
    console.warn('Charm bracelet unavailable.', error);
  }
}
