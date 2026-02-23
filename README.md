# Sapna Portfolio (GitHub Pages)

## 1) Folder structure
- index.html
- css/styles.css
- js/data.js        ← edit content here
- js/main.js        ← UI renderer + interactions
- assets/           ← images, logos, resume (already included)

## 2) Update instructions (no UI refactor needed)
### Hero
Edit `js/data.js` → `SITE.profile`:
- `name`, `designation`, `tagline`, `location`
- `social.*` links
- `resume` path and `photo` path

### About Sapna + What Am I Reading?
Edit `SITE.about.intro` and `SITE.about.reading`.

### Journey (timeline)
Edit `SITE.journey[]`:
- `role`, `org`, `place`, `start`, `end`, `logo`

### Stack (icons grid)
Edit `SITE.stack`:
- group name → array of `{ name, icon }`

### Credentials
Edit `SITE.credentials.linkedinCerts`

### Talks / Writings / Build carousels
Edit `SITE.talks[]`, `SITE.writings[]`, `SITE.builds[]`.

Note: LinkedIn event pages usually block iframe embedding. This template uses cover images and an “Open Event” link by default.

### Academics
Edit `SITE.academics[]`

## 3) Deploy on GitHub Pages
- Push this folder to a GitHub repo (root).
- Settings → Pages → Deploy from branch → `main` / root.

## 4) Performance notes
- No external frameworks.
- Data-driven rendering keeps future updates fast and safe.
