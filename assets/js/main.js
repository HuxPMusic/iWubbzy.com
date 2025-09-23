(function(){
  var docEl = document.documentElement;
  var btn   = document.querySelector('[data-theme-toggle]');
  var label = btn ? btn.querySelector('[data-theme-label]') : null;

  function applyTheme(t){
    if (t === 'dark' || t === 'light') {
      docEl.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch(e){}
      if (label) label.textContent = (t === 'dark') ? 'Dark' : 'Light';
      if (btn) btn.setAttribute('aria-pressed', String(t === 'dark'));
    }
  }

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
  } catch(e){}

  if (btn) {
    btn.addEventListener('click', function(){
      var current = docEl.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
