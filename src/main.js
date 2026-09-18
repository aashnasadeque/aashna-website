import './style.css';
import './interactive.css';
import './editorial.css';

document.querySelector('#year').textContent = new Date().getFullYear();
const notes = {
  movement: ['01 / MOVEMENT', 'I teach group fitness and love making spaces where people feel welcome.'],
  making: ['02 / MAKING', 'From software and hardware to custom cakes, I like turning ideas into things people can use and enjoy.'],
  community: ['03 / CONNECTION', 'I help grow WEST and care deeply about women in technology, communication, and belonging.'],
};
document.querySelectorAll('.collage-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.collage-tabs button').forEach((tab) => tab.setAttribute('aria-pressed', String(tab === button)));
    const [label, description] = notes[button.dataset.note];
    document.querySelector('#collage-number').textContent = label;
    document.querySelector('#collage-description').textContent = description;
    document.querySelector('.hero-visual').dataset.active = button.dataset.note;
  });
});

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
