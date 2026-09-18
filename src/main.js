import gsap from 'gsap';
import './style.css';
import './interactive.css';
import './personality.css';
import './opening.css';
import './section-colors.css';
import './hero-monochrome.css';
import './minimal.css';

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
    card.classList.toggle('is-open');
    card.classList.remove('is-hovered');
    sync();
  });
  sync();
});
