# neverleft

Take the chaos out of peaceful camping.

Open [`index.html`](index.html) in your browser for a fully offline-capable single-page app (data stays on this device unless you export a backup).

## Hosted PWA (Netlify)

When served over **HTTPS** (e.g. [neverleft.netlify.app](https://neverleft.netlify.app/)), the app registers a **service worker** so the shell can load offline after at least one successful online visit. Your trips and kit still live in **`localStorage`**; use **Download backup** to move data between devices or keep a JSON snapshot.

### After you change `index.html` or `sw.js`

1. Bump **`SHELL_CACHE`** in [`sw.js`](sw.js) (e.g. `neverleft-shell-v1` → `neverleft-shell-v2`) so browsers drop the old precache.
2. Optionally bump **`FONT_CACHE`** if you change font caching behaviour.
3. Deploy; users may need a **second visit** or reload to pick up the new worker.

### Repo layout

| File | Purpose |
|------|---------|
| [`manifest.json`](manifest.json) | Web app manifest (name, icons, theme, `start_url`). |
| [`sw.js`](sw.js) | Service worker: precache shell, network-first navigation, font caching. |
| [`netlify.toml`](netlify.toml) | Publish dir + headers for `sw.js` and `manifest.json`. |
| [`icons/`](icons/) | `icon-192.png`, `icon-512.png` for install / home screen. |
