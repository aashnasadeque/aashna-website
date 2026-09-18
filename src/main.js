import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';
import './interactive.css';
import './personality.css';
import { initOrbit } from './orbit.js';

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

initOrbit({ reducedMotion });
