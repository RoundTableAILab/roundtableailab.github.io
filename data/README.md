# Writing Data Format

Edit `writings.json` to add or update articles.

## Required fields per item

- `id`: unique stable id, recommended format `YYYY-MM-DD-topic-slug`
- `author`: member id from `members.json` (e.g. `"lijun"`)
- `date`: publish date in `YYYY-MM-DD`
- `title`: localized object, at least one language key (`en`/`zh`/`ja`/`fr`)
- `summary`: localized object, at least one language key (`en`/`zh`/`ja`/`fr`)
- `links`: object with at least one of:
  - `linkedin`
  - `x`

## Optional fields

- `pinned`: `true` puts the item ahead of non-pinned items

## Display rules

- Sorted by: `pinned` first, then `date` descending
- Fallback text: if current language is missing, fallback to `en`, then `zh`, `ja`, `fr`
- Auto-translation: if current language is missing, the page tries to auto-translate title/summary at runtime and caches the result in memory
- Primary card click: opens `linkedin` if present, otherwise `x`
- Platform buttons: only rendered for links that exist

## Recommendation

- For best quality, provide at least one high-quality source language (`en` recommended)
- Auto-translation is a convenience layer; nuanced wording can still be refined manually later
