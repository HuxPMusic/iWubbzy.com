
/* Minimal JS to handle nav highlights and lazy placeholders */
document.addEventListener("DOMContentLoaded", () => {
  const here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute("href");
    if (href && (href === here || (href !== "/" && here.startsWith(href)))) {
      a.setAttribute("aria-current","page");
    }
  });
  const yearSpan = document.querySelector("#year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
