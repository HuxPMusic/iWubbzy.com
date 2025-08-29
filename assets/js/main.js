
document.addEventListener("DOMContentLoaded", () => {
  // nav highlight
  const here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute("href");
    if (href && (href === here || (href !== "/" && here.startsWith(href)))) {
      a.setAttribute("aria-current","page");
    }
  });
  const y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();

  // theme toggle (persist + sync to giscus)
  const key = "theme";
  const btn = document.querySelector("[data-theme-toggle]");
  function currentPrefersDark(){ return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function getTheme(){
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") return saved;
    return currentPrefersDark() ? "dark" : "light";
  }
  function setTheme(next){
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(key, next);
    if (btn) {
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      const label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = next === "dark" ? "Dark" : "Light";
    }
    // giscus theme sync
    const iframe = document.querySelector("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow.postMessage({
        giscus: { setConfig: { theme: next === "dark" ? "dark" : "light" } }
      }, "https://giscus.app");
    }
  }
  setTheme(getTheme());
  if (btn) btn.addEventListener("click", () => setTheme(getTheme()==="dark" ? "light" : "dark"));
});
