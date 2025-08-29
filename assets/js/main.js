
document.addEventListener("DOMContentLoaded", () => {
  const here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute("href");
    if (href && (href === here || (href !== "/" && here.startsWith(href)))) {
      a.setAttribute("aria-current","page");
    }
  });
  const y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
});


// Theme toggle
(function(){
  const key = "theme";
  const saved = localStorage.getItem(key);
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
  const btn = document.querySelector("[data-theme-toggle]");
  function setTheme(next){
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(key, next);
    if (btn) btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    if (btn) btn.querySelector("[data-theme-label]").textContent = next === "dark" ? "Dark" : "Light";
  }
  if (btn){
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
      setTheme(cur === "dark" ? "light" : "dark");
    });
    // initialize label
    const current = document.documentElement.getAttribute("data-theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    btn.setAttribute("aria-pressed", current === "dark" ? "true" : "false");
    btn.querySelector("[data-theme-label]").textContent = current === "dark" ? "Dark" : "Light";
  }
})();
