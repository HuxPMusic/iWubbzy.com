
iWubbzy fanart + theme update
-----------------------------
Includes:
- New wordmark logo (/assets/img/logo.png)
- Wallpapers: outside.png (light), underwater.png (dark)
- Wubbzy hero (glasses) for homepage foreground
- Updated favicons/app icons + site.webmanifest
- Mobile hamburger menu
- Footer credit to Pavlova Cookie / Whopper (@epicfridge on Discord)
- Sidebar "Fanart Spotlight" block for Malka's art (replaces the old In Every Episode slot)

How to apply:
1) Copy everything to your repo root, preserving folders.
2) In each page <head>:
   <link rel="stylesheet" href="/assets/css/iwubbzy-update.css">
   (paste snippets/head-icons.html here)
3) Replace header/footer markup with snippets/header.html & snippets/footer.html (or merge).
4) On the homepage, add the hero image where appropriate:
   <img id="hero-wubbzy" src="/assets/img/wubbzy-hero.png" alt="Wubbzy with glasses">
5) Replace the "In Every Episode" sidebar block with the contents of snippets/sidebar-fanart-malka.html.
6) Include the JS helper before </body>:
   <script src="/assets/js/iwubbzy-update.js" defer></script>

Note: If you also keep a root /favicon.ico, bump query strings (?v=4) or clear cache to see the new icon.
