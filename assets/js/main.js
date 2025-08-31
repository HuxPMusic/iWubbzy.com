
document.addEventListener("DOMContentLoaded", () => {
  const here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute("href");
    if (href && (href === here || (href !== "/" && here.startsWith(href)))) {
      a.setAttribute("aria-current","page");
    }
  });
  const y = document.querySelector("#year"); if (y) y.textContent = new Date().getFullYear();

  const key = "theme"; const btn = document.querySelector("[data-theme-toggle]");
  function prefersDark(){ return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function getTheme(){ try { const saved = localStorage.getItem(key); if (saved === "light" || saved === "dark") return saved; } catch(e){} return prefersDark() ? "dark" : "light"; }

  function syncGiscusTheme(theme){
    let tries = 0;
    const send = () => {
      const iframe = document.querySelector("iframe.giscus-frame");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ giscus:{ setConfig:{ theme: (theme === "dark" ? "dark" : "light") } } }, "https://giscus.app");
        return true;
      }
      return false;
    };
    if (!send()){
      const timer = setInterval(() => { tries++; if (send() || tries > 50) clearInterval(timer); }, 100);
    }
  }

  function setTheme(next){
    document.documentElement.setAttribute("data-theme", next);
    try{ localStorage.setItem(key, next); }catch(e){}
    if (btn) {
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      const label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = next === "dark" ? "Dark" : "Light";
    }
    syncGiscusTheme(next);
  }

  setTheme(getTheme());
  if (btn) btn.addEventListener("click", () => setTheme(getTheme()==="dark" ? "light" : "dark"));
});
