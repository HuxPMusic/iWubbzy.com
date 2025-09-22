
// Mobile menu toggle
(function(){
  const btn = document.querySelector('[data-nav-toggle]');
  const list = document.querySelector('.nav ul');
  if(!btn || !list) return;
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
// Footer year fill
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
