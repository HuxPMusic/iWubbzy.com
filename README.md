# iWubbzy.com

Unofficial, non commercial fan resource for **Wow! Wow! Wubbzy!**  
Live site: https://iwubbzy.com  
Community chat: https://discord.gg/BsuEbysrHB

This repo holds a simple static site that tries to feel like the classic Nick Jr. era while staying modern and easy to maintain. There is no build step. Everything is plain HTML, CSS, and a little JavaScript.

## What you get

- Static site that works on GitHub Pages
- Light and dark mode with a toggle button (also respects system setting)
- Archive section with direct downloads from `/downloads/`
- Social share previews for Discord, X, and Facebook
- Full favicon set including Apple and Android app icons
- Clean navigation with a Discord link instead of a forum

## Repo layout

```
.
├── index.html                 # Home
├── archive/
│   └── index.html             # Archive grid and links
├── forum/
│   └── index.html             # Discord CTA page
├── downloads/                 # Downloadable files used by Archive
├── assets/
│   ├── css/                   # Styles
│   ├── js/                    # Minimal scripts
│   └── img/                   # Images and icons (logo, favicons, social previews)
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── site.webmanifest
└── sitemap.xml
```

## Local development

You can open `index.html` in a browser, or use a tiny local server.

**Python 3**
```bash
python -m http.server 8000
# then visit http://localhost:8000
```

**VS Code Live Server**
- Install the Live Server extension
- Right click `index.html` and choose Open with Live Server

## Deploy on GitHub Pages

1. Push to your `main` branch.
2. In your repo, open **Settings → Pages**.
3. Set **Build and deployment** to **Deploy from a branch**.
4. Choose **Branch: main** and **/ (root)**.
5. Save. Pages will publish to `https://<username>.github.io/iWubbzy.com/` or your custom domain if configured.

**Custom domain**
- Add `iwubbzy.com` in **Settings → Pages → Custom domain**
- Add the required DNS records at your registrar. Typical setup is:
  - `CNAME` at `www` pointing to `<username>.github.io`
  - `A` records for the apex pointing to the GitHub Pages IPs
- GitHub will create a `CNAME` file at the repo root

## Editing content

### Home page
Edit `index.html`. The welcome post is a placeholder and can be changed freely.

### Archive
Edit `archive/index.html`. Each card has a preview image and a row of download buttons. Files should live in `/downloads/` to avoid broken links.

**Add a new item**
1. Put your file into `downloads/` with a clear name, for example `wubbzy_amazing_adventure_16x9.png`.
2. Add a card to `archive/index.html` inside the `<div class="gallery">`. You can copy this template:
```html
<article class="card" style="padding:0">
  <img src="/downloads/example_preview.jpg" alt="Example preview" style="width:100%;height:auto;border-top-left-radius:.75rem;border-top-right-radius:.75rem">
  <div style="padding:1rem">
    <h3 style="margin:.2rem 0 0">Title of the item</h3>
    <p class="muted">Credit text. Optional source link.</p>
    <div class="dl" style="display:flex;flex-wrap:wrap;gap:.5rem">
      <a class="btn" href="/downloads/example_file.ext" target="_blank" rel="noopener">Download</a>
    </div>
  </div>
</article>
```

### Social previews
Images for link previews live at:
- `assets/img/social-og.jpg` (1200x630 for Open Graph)
- `assets/img/social-tw.jpg` (1200x628 for X)

You can replace those two files to change the preview image. No code changes needed unless you move the files.

### Icons and manifest
All favicons and app icons use the iW logo:
- Root: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`
- Mobile and PWA: `assets/img/app-icon-192.png`, `assets/img/app-icon-512.png`
- Extra: `assets/img/favicon-512.png`

The manifest is `site.webmanifest`. If you change icon sizes or paths, update the `"icons"` array there.

## Style and accessibility

- The site has a skip link for keyboard users. It only appears when focused.
- Please keep copy simple and clear. Do not use em dashes.
- Use descriptive `alt` text on images.
- Keep filenames lowercase with hyphens or underscores.

## Contributing

Pull requests are welcome. If you plan a large change, open an issue first. For new Archive items, include preview images if possible.

## Credits

Site owner: **HuxP** (HuxPMusic)  
The site is a fan project. It is not affiliated with Bob Boyle, Bolder Media, Starz Media, Nick Jr., Noggin, Viacom, or any rights holders. All trademarks and character art belong to their respective owners.

## License

Code license to be decided. Content from the original show and network is owned by the rights holders and used here for fan purposes only.
