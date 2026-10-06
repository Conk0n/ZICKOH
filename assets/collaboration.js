(() => {
  const track = document.getElementById('collab-track');
  const controls = document.querySelector('.collab-controls');
  if (!track || !controls) return;
  controls.hidden = false;
  const buttons = [...controls.querySelectorAll('button')];
  const update = () => {
    buttons[0].disabled = track.scrollLeft <= 2;
    buttons[1].disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => {
    const card = track.querySelector('.collab-slide');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  buttons.forEach(button => button.addEventListener('click', () => move(Number(button.dataset.direction))));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
