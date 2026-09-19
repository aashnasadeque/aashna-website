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
const colourGate = document.querySelector('#colour-gate');
const colourForm = document.querySelector('#colour-form');
const colourInput = document.querySelector('#favourite-colour');
const colourError = document.querySelector('#colour-error');
const typedQuestion = document.querySelector('#typed-question');

app.inert = true;
document.body.classList.add('opening-active');
const skipOpening = document.querySelector('#skip-opening');
let introTimeline;
let openingReady = false;
const finishOpening = (scrollToSite = false) => {
  if (!openingReady) {
    introTimeline?.kill();
    gsap.set('.opening-smile', { display: 'none' });
    gsap.set('.opening-center', { opacity: 1, scale: 1 });
    gsap.set('.opening-line > span, .opening-center p', { clearProps: 'all' });
    opening.classList.add('is-ready');
    app.inert = false;
    document.body.classList.remove('opening-active');
    skipOpening.textContent = 'EXPLORE SITE ↓';
    openingReady = true;
  }
  if (scrollToSite) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: opening.offsetHeight, behavior: 'auto' });
    });
  }
};
skipOpening.addEventListener('click', () => finishOpening(true));

introTimeline = gsap.timeline({ paused: true, onComplete: () => finishOpening() });
introTimeline
  .set('.smile-mouth', { strokeDasharray: 65, strokeDashoffset: 65 })
  .fromTo('.opening-hi', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)' })
  .to('.hi-h', { x: -5, y: -10, scale: .1, opacity: 0, duration: .65, ease: 'power2.inOut' }, '+=.45')
  .to('.hi-i', { x: 3, y: -10, scale: .1, opacity: 0, duration: .65, ease: 'power2.inOut' }, '<')
  .to('.smile-eye', { opacity: 1, duration: .38, stagger: .05, ease: 'power2.out' }, '<+.3')
  .to('.smile-mouth', { opacity: 1, strokeDashoffset: 0, duration: .55, ease: 'power2.out' }, '<+.08')
  .to('.smile-ring', { opacity: 1, duration: .35 }, '<+.1')
  .addLabel('faceReady')
  .to('.smile-ring', { rotation: 100, duration: 3.3, ease: 'none' }, 'faceReady+=.7')
  .to('.smile-eye-right', { opacity: 0, duration: .12 }, 'faceReady+=1.5')
  .to('.smile-wink', { opacity: 1, duration: .12 }, '<')
  .to('.smile-wink', { opacity: 0, duration: .12 }, '+=.32')
  .to('.smile-eye-right', { opacity: 1, duration: .12 }, '<')
  .to('.opening-smile', { opacity: 0, scale: 1.25, duration: .3, ease: 'power2.in' }, 'faceReady+=3.95')
  .set('.opening-smile', { display: 'none' })
  .to('.opening-center', { opacity: 1, duration: .01 })
  .from('.opening-line > span', { yPercent: 115, duration: .65, stagger: .1, ease: 'power3.out' })
  .from('.opening-center p', { opacity: 0, y: 14, duration: .3, ease: 'power2.out' }, '-=.2');

const startOpening = (colour) => {
  document.documentElement.style.setProperty('--intro-color', colour);
  colourGate.classList.add('is-leaving');
  window.setTimeout(() => {
    colourGate.hidden = true;
    opening.hidden = false;
    window.scrollTo(0, 0);
    if (reducedMotion && !replayRequested) finishOpening();
    else introTimeline.play(0);
  }, reducedMotion ? 0 : 350);
};

colourForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const colour = colourInput.value.trim();
  const blockedValues = ['inherit', 'initial', 'unset', 'revert', 'currentcolor', 'transparent'];
  if (!colour || blockedValues.includes(colour.toLowerCase()) || !CSS.supports('color', colour)) {
    colourError.textContent = 'TRY A COLOUR NAME OR HEX CODE';
    colourInput.focus();
    return;
  }
  colourError.textContent = '';
  startOpening(colour);
});

const question = "what's your favourite colour?";
if (reducedMotion) {
  typedQuestion.textContent = question;
  colourForm.hidden = false;
  colourInput.focus();
} else {
  let letter = 0;
  const typeQuestion = window.setInterval(() => {
    typedQuestion.textContent = question.slice(0, ++letter);
    if (letter === question.length) {
      window.clearInterval(typeQuestion);
      window.setTimeout(() => {
        colourForm.hidden = false;
        colourInput.focus();
      }, 250);
    }
  }, 58);
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
