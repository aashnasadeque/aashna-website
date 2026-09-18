import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';
import './interactive.css';
import './personality.css';
import './opening.css';
import './section-colors.css';
import './hero-monochrome.css';
import { initOrbit } from './orbit.js';

document.querySelector('#year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const replayRequested = new URLSearchParams(window.location.search).has('intro');
const opening = document.querySelector('#opening');
const app = document.querySelector('#app');

if (!reducedMotion || replayRequested) {
  opening.hidden = false;
  app.inert = true;
  document.body.classList.add('opening-active');
  const closeOpening = () => {
    introTimeline.kill();
    opening.hidden = true;
    app.inert = false;
    document.body.classList.remove('opening-active');
  };
  const introTimeline = gsap.timeline({ onComplete: closeOpening });
  introTimeline
    .set('.smile-mouth', { strokeDasharray: 65, strokeDashoffset: 65 })
    .fromTo('.opening-hi', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)' })
    .to('.hi-h', { x: -5, y: -10, scale: .1, opacity: 0, duration: .65, ease: 'power2.inOut' }, '+=.45')
    .to('.hi-i', { x: 3, y: -10, scale: .1, opacity: 0, duration: .65, ease: 'power2.inOut' }, '<')
    .to('.smile-eye', { opacity: 1, duration: .38, stagger: .05, ease: 'power2.out' }, '<+.3')
    .to('.smile-mouth', { opacity: 1, strokeDashoffset: 0, duration: .55, ease: 'power2.out' }, '<+.08')
    .to('.smile-ring', { opacity: 1, duration: .35 }, '<+.1')
    .addLabel('faceReady')
    .to('.smile-ring', { rotation: 180, duration: 6.2, ease: 'none' }, 'faceReady+=.7')
    .to('.smile-eye-right', { opacity: 0, duration: .12 }, 'faceReady+=1.5')
    .to('.smile-wink', { opacity: 1, duration: .12 }, '<')
    .to('.smile-wink', { opacity: 0, duration: .12 }, '+=.32')
    .to('.smile-eye-right', { opacity: 1, duration: .12 }, '<')
    .to('.opening-smile', { opacity: 0, scale: 1.25, duration: .4, ease: 'power2.in' }, 'faceReady+=6.85')
    .set('.opening-smile', { display: 'none' })
    .to('.opening-center', { opacity: 1, duration: .01 })
    .from('.opening-line > span', { yPercent: 115, duration: .9, stagger: .13, ease: 'power3.out' })
    .from('.opening-center p', { opacity: 0, y: 14, duration: .45, ease: 'power2.out' }, '-=.28')
    .to('.opening-center', { scale: 1.035, duration: .45, ease: 'power1.inOut' }, '+=.45')
    .to(opening, { yPercent: -100, duration: .9, ease: 'power3.inOut' }, '-=.08');
  document.querySelector('#skip-opening').addEventListener('click', closeOpening);
}

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
  gsap.utils.toArray('.project-card').forEach((element) => {
    gsap.from(element, { y: 34, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });

  const scrollDepth = (element, trigger, from, start = 'top 92%', end = 'top 38%') => {
    gsap.fromTo(element,
      { ...from, transformPerspective: 1100, transformOrigin: 'center center' },
      { rotationX: 0, rotationY: 0, z: 0, scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger, start, end, scrub: .6, invalidateOnRefresh: true } });
  };

  scrollDepth('.hero-visual', '.hero', { rotationY: -7, rotationX: 4, z: -70, scale: .97, opacity: 1 }, 'top top', 'bottom top');
  scrollDepth('.about-layout h2', '#about', { rotationY: -15, rotationX: 8, z: -100, scale: .94, opacity: .7 });
  scrollDepth('.about-copy', '#about', { rotationY: 12, rotationX: -5, z: -75, scale: .96, opacity: .75 });
  gsap.fromTo('.about-links-art', { rotationY: -45, rotationX: -18, z: -130, opacity: .18 },
    { rotationY: 48, rotationX: 18, z: 40, opacity: .85, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top 95%', end: 'bottom 30%', scrub: .7 } });
  gsap.utils.toArray('.project-art').forEach((art, index) => {
    scrollDepth(art, art.closest('.project-card'), { rotationY: index % 2 ? 13 : -13, rotationX: 8, z: -90, scale: .92, opacity: .7 });
  });
  gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    scrollDepth(item, item, { rotationY: index % 2 ? 12 : -12, rotationX: 7, z: -85, scale: .96, opacity: .72 }, 'top 96%', 'top 48%');
  });
  gsap.fromTo('.experience-stack', { rotationY: -55, rotationX: 18, z: -130, opacity: .15 },
    { rotationY: 43, rotationX: -14, z: 35, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#experience', start: 'top 95%', end: 'bottom 35%', scrub: .7 } });
  gsap.utils.toArray('.beyond-card').forEach((card, index) => {
    scrollDepth(card, '#beyond', { rotationY: (index - 1.5) * 10, rotationX: 10, z: -120, scale: .92, opacity: .65 }, 'top 85%', 'center 55%');
  });
  scrollDepth('.contact-section h2', '#contact', { rotationX: 20, rotationY: -7, z: -130, scale: .91, opacity: .68 }, 'top 95%', 'top 35%');
  gsap.fromTo('.contact-knot', { rotationX: -35, rotationY: -40, scale: .7, opacity: .2 },
    { rotationX: 35, rotationY: 70, scale: 1, opacity: .7, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 95%', end: 'bottom bottom', scrub: .7 } });
}

initOrbit({ reducedMotion });
