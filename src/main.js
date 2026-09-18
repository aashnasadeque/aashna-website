import './style.css';
import './interactive.css';
import './personality.css';
import './section-colors.css';
import './hero-monochrome.css';
import './minimal.css';

document.querySelector('#year').textContent = new Date().getFullYear();

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
