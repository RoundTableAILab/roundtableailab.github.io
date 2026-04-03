# RoundTable AI Lab

Official website for [RoundTable AI Lab](https://roundtableailab.org) — AI tools research, market insights, and honest perspectives.

## Local Preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

## Structure

```
index.html              Main page
shared/
  style.css             All shared styles
  nav.js                Theme, i18n, writings renderer
  particles.js          Background effects (stars, particles, seats)
data/
  members.json          Member profiles
  writings.json         Article index (multilingual, per-author)
  README.md             Data format docs
```

## Adding Content

**New article** — Add an entry to `data/writings.json` with `author`, `date`, `title`, `summary`, and `links`.

**New member** — Add an entry to `data/members.json` with `id`, `name`, `role`, and optional fields.

See [data/README.md](data/README.md) for field details.

## Tech

- Pure static HTML/CSS/JS — no build tools
- Hosted on GitHub Pages
- 4-language i18n (EN / 中文 / 日本語 / FR)
- Dark/light theme with system preference detection