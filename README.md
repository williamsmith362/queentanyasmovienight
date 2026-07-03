# Queen Tanya's Movie Night 🎬💖

A private, personal streaming site — a little Netflix built for one person.

This is a **refactor** of an earlier single-HTML-file version into a clean,
modular project. Every feature, animation, and pixel of the pastel-pink
design is unchanged — only the code organization changed.

---

## Folder structure

```
queen-tanyas-movie-night/
│
├── index.html              The single HTML page (a small single-page app)
│
├── css/
│   ├── style.css           Design tokens, resets, page layout regions
│   ├── components.css      Reusable widgets: nav, search box, chips, cards, player controls
│   └── animations.css      @keyframes + prefers-reduced-motion handling
│
├── js/
│   ├── app.js               Entry point — wires every module together
│   ├── router.js            Hash-based navigation (library <-> player)
│   ├── player.js             Video playback logic (source, speed, PiP)
│   ├── library.js            Builds movie cards + combined filter/search visibility
│   ├── filters.js            Category filter chips
│   ├── search.js              Search input handling
│   ├── thumbnails.js          Generates gradient placeholder thumbnails
│   ├── movies.js               The movie/show database
│   ├── ui.js                    Shared icon SVGs + tiny DOM helpers
│   └── utils.js                  Generic helpers (escaping, padding, color math)
│
├── assets/
│   ├── icons/               Future icon assets (favicon, PWA icons, etc.)
│   ├── logos/                Future logo/wordmark assets
│   └── posters/                Real poster art, once you have any (see below)
│
├── videos/
│   ├── vampire-diaries/       Your Vampire Diaries video files go here
│   ├── love-island/            Your Love Island video files go here
│   └── coraline.mp4              Your Coraline file goes here
│
├── workers/
│   └── api.js                An optional Cloudflare Worker backend stub (not required to run the site)
│
├── package.json
├── wrangler.toml             Cloudflare deployment config (for workers/api.js)
└── README.md                 You are here
```

---

## How the pieces fit together

`index.html` loads `js/app.js` as an ES module (`<script type="module">`),
and every other JS file is imported from there or from each other with
normal `import` / `export` statements — there's no build step or bundler,
the browser loads the modules directly.

Rough data flow:

```
movies.js  ──────────────►  MOVIES array (the single source of truth)
                                   │
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
           library.js         filters.js         player.js
        (renders cards)    (category chips)    (video playback)
                 │                 │
                 └───────┬─────────┘
                         ▼
                  app.js combines category + search
                  and asks library.js to re-filter
```

`router.js` listens for URL hash changes (`#/` vs `#/movie/<id>`) and
toggles which "view" (`#libraryView` / `#playerView`) is visible, calling
`player.js` to load the requested movie.

---

## How to add a movie

Open `js/movies.js` and push a plain object onto the `MOVIES` array:

```javascript
MOVIES.push({
  id: "unique-id",              // lowercase, no spaces — used in the URL
  title: "Display Title",
  category: "Some Category",    // groups it under a filter chip
  description: "One or two sentences.",
  video: "videos/your-file.mp4",
  runtime: "1:32:00",
  accent: "#ec6fa0",             // hex color used for its thumbnail
});
```

Save the file — the homepage, filters, and search all pick it up
automatically. Nothing else needs to change.

## How to add a TV show (with seasons/episodes)

Follow the pattern already used for Vampire Diaries and Love Island near
the top of `js/movies.js`:

1. Store your show's episode titles (or just episode counts per season,
   if the show doesn't have unique titles — like Love Island) in a small
   array/array-of-arrays.
2. Loop over it to build `MOVIES` entries with a consistent `id` and
   `video` path pattern, e.g. `videos/your-show/s01e01.mp4`.

This keeps a 100+ episode show maintainable without hand-writing every
object, and keeps ids/paths predictable so file-matching stays easy.

## How to add posters (real artwork instead of generated thumbnails)

By default, every movie gets a small generated gradient thumbnail (see
`js/thumbnails.js`) — no images required, nothing to break if you're
offline.

To use real artwork instead:

1. Drop an image into `assets/posters/` (e.g. `assets/posters/coraline.jpg`).
2. Add a `thumbnail` field to that movie's object in `js/movies.js`:
   ```javascript
   thumbnail: "assets/posters/coraline.jpg",
   ```
`library.js` always checks `movie.thumbnail` first, so this instantly
overrides the generated version for that one entry.

## How to add your video files

Videos are **not** included in this project (for size and copyright
reasons) — only the file paths are pre-configured. Drop your own files
into `/videos` matching the paths already set in `js/movies.js`:

- Vampire Diaries: `videos/vampire-diaries/s01e01.mp4`, `s01e02.mp4`, …
- Love Island: `videos/love-island/s01e01.mp4`, `s01e02.mp4`, …
- Coraline: `videos/coraline.mp4`

Nothing else needs to change — the player will pick up any file that
matches the path already on the movie object.

---

## Running it locally

This is a static site — no build step, no server-side code required to
just browse it. Because browsers restrict local file access for
security (and ES modules specifically require it), serve the folder over
a simple local server rather than opening `index.html` directly:

```bash
npm install      # only needed once, installs wrangler for later deploys
npm start
```

This runs a local static server (via `npx serve`) at
`http://localhost:8000`. If you don't want to use npm at all, Python
works too:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

---

## Deploying to Cloudflare Pages

The site is a plain static folder, so Cloudflare Pages needs no build
command or output directory beyond the project root:

**Option A — via the Cloudflare dashboard**
1. Push this project to a GitHub/GitLab repo.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, select the repo.
3. Build settings: leave **Build command** empty and set **Build output
   directory** to `/` (the project root).
4. Deploy.

**Option B — via the command line**
```bash
npm install
npm run deploy:pages
```
This uses `wrangler pages deploy .`, which uploads the current folder
directly without needing a connected Git repo.

### Deploying the optional backend (workers/api.js)

The site runs perfectly without this — it's a stub for future features
(see below). When you're ready to use it:

```bash
npm run deploy:worker
```
This deploys `workers/api.js` using the settings in `wrangler.toml`.
Uncomment the relevant bindings in `wrangler.toml` (R2 bucket, KV
namespace, or D1 database) as each feature needs them.

---

## Future ideas (scaffolded, not yet built)

The codebase was organized with these in mind, so none of them should
require restructuring the project to add later:

| Feature | Where it would plug in |
|---|---|
| Login / multiple users / profiles | New `js/auth.js` module + `workers/api.js` endpoints |
| Favorites | A `favorite` field on movie objects (or user-scoped list from the Worker), a new filter chip, a heart button in `library.js`'s card markup |
| Continue watching | `video.currentTime` saved periodically in `player.js`, restored on load; persisted via `workers/api.js` for cross-device sync |
| Watch history | Same mechanism as continue watching, kept as a log rather than a single position |
| Subtitles | A `<track>` element inside the `<video>` tag in `index.html`, sourced from a `subtitles` field on the movie object |
| Themes (e.g. a dark mode) | All colors already live in CSS variables at the top of `css/style.css` — a second `:root[data-theme="dark"]` block plus a small toggle in `ui.js` would cover most of it |
| Cloudflare Worker backend | `workers/api.js` — currently a stub with a `/api/health` route and commented-out endpoint shapes |
| Cloudflare R2 video storage | Uncomment the R2 binding in `wrangler.toml`, then have `workers/api.js` generate signed URLs instead of serving from `/videos` directly |
| Progressive Web App support | Add a `manifest.json` at the project root (there's a commented-out `<link rel="manifest">` already in `index.html`) and a service worker registered from `app.js` |
| Mobile responsiveness | Already implemented — see the `@media` block at the bottom of `css/style.css` |

---

Made with 💖 for Tanya.
