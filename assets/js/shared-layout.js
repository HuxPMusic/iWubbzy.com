(function(){
  function normalizePath(path) {
    if (!path || path === '') return '/';
    if (path !== '/' && path.endsWith('/index.html')) path = path.slice(0, -10);
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path || '/';
  }

  function setActiveNav(container) {
    if (!container) return;
    var current = normalizePath(window.location.pathname);
    container.querySelectorAll('a[href^="/"]').forEach(function(link){
      var href = normalizePath(link.getAttribute('href'));
      if (href === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function loadSnippet(selector, url, afterLoad) {
    var target = document.querySelector(selector);
    if (!target) return Promise.resolve();

    return fetch(url)
      .then(function(response){
        if (!response.ok) throw new Error('Failed to load ' + url);
        return response.text();
      })
      .then(function(html){
        target.innerHTML = html;
        if (afterLoad) afterLoad(target);
      })
      .catch(function(error){
        console.error(error);
      });
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadSnippet('[data-include="header"]', '/snippets/header.html', setActiveNav);
    loadSnippet('[data-include="footer"]', '/snippets/footer.html');
  });
})();
