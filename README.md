# iWubbzy Fan (Modernized Skeleton)

A minimal, modern, accessible reboot for **iWubbzy.com** (fan-operated). Most content is intentionally blank for now.

- Responsive layout, sensible defaults, dark‑mode support
- Accessible nav with skip‑link
- No blog posts
- Helpers for mapping legacy URLs: see `legacy/`

## Structure
```
/
  index.html
  404.html
  /characters/
  /episodes/
  /games/
  /music/
  /gallery/
  /about/
  /contact/
  /assets/css/style.css
  /assets/js/main.js
  /assets/img/...
  /legacy/legacy_map.csv
  /legacy/legacy_urls.json
```
## Using the Archive (provided ZIP)
This build inspected your archive and extracted a list of HTML paths and any detected page `<title>` elements into:
- `legacy/legacy_map.csv`
- `legacy/legacy_urls.json`

Use these to plan redirects and decide which legacy pages to migrate first.

## Add Content
Edit each page’s placeholder card. Keep it static or wire it to your generator of choice later.

## Domain + Hosting
- Root domain: `iwubbzy.com` (update A/AAAA to your host, or a CNAME if using Pages)
- For GitHub Pages: create repo, push these files, and set the custom domain to `iwubbzy.com`.
- Ensure the DNS has an ALIAS or A record to your host. For GitHub Pages, add `CNAME` file or use the repo Settings → Pages.

## Notes
- Site owner credit appears in the footer (HuxP / HuxPMusic.com).
- Colors are adjustable in `:root` variables inside `assets/css/style.css`.
- Icons are placeholders — replace with your own artwork when ready.
- Please verify legal/fair‑use of any legacy assets you migrate.
