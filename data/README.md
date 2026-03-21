# Writing Data Format

Edit `writings.json` to add or update articles.

## Required fields per item

- `id`: unique stable id, recommended format `YYYY-MM-DD-topic-slug`
- `date`: publish date in `YYYY-MM-DD`
- `title`: localized object with `en`, `zh`, `ja`, `fr`
- `summary`: localized object with `en`, `zh`, `ja`, `fr`
- `links`: object with at least one of:
  - `linkedin`
  - `x`

## Optional fields

- `pinned`: `true` puts the item ahead of non-pinned items

## Display rules

- Sorted by: `pinned` first, then `date` descending
- Fallback text: if current language is missing, fallback to `en`
- Primary card click: opens `linkedin` if present, otherwise `x`
- Platform buttons: only rendered for links that exist
