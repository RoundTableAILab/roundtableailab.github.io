# Changelog

All notable changes to the RoundTable AI Lab website will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [v3.5.0] - 2026-04-07

### Added
- Mobile hamburger menu (☰) for section navigation on small screens
- Single-button theme toggle for mobile (tap to switch dark ↔ light)
- Language switcher moved into mobile menu dropdown
- `toggleTheme()` function for one-tap theme switching
- Auto-close mobile menu on link tap

### Changed
- Desktop nav unchanged — dual theme buttons and inline language switcher preserved
- Mobile nav streamlined: Logo + ☀/🌙 + ☰ only in top bar

## [v3.4.0] - 2026-04-07

### Added
- Now section card #05: Community Talk · OpenClaw — with dual links to event info page and YouTube Shorts video
- `nc-links` / `nc-tag-link` CSS for multiple clickable tag-links within a card
- i18n translations for the new card in all 4 languages (EN, 中文, 日本語, FR)

## [v3.3.1] - 2026-04-06

### Added
- Floating QR code button (bottom-right) with popup panel for easy mobile scanning
- `qrcode.png` — QR code linking to roundtableailab.org
- QR float styles with dark/light theme support and mobile responsiveness

## [v3.3.0] - 2026-04-04

### Added
- `shared/style.css` — All CSS extracted from index.html
- `shared/nav.js` — Cursor, theme, i18n, and writings rendering logic
- `shared/particles.js` — Stars, particles, seats, and background effects
- `data/members.json` — Member data structure (first member: lijun)
- `author` field added to all entries in `data/writings.json`
- i18n translations for pill6 (Think Tank) and pill7 (Consulting)

### Changed
- `index.html` reduced from ~1200 lines to ~296 lines (pure HTML structure)
- Asset paths changed from relative to absolute (subpage-ready)
- External links now include `rel="noopener noreferrer"`

### Infrastructure
- Shared CSS/JS layer ready for subpages (members, writings, openclaw)

## [v3.2.8] - 2026-04-03
- Add new article: Claude Code howto guide

## [v3.2.7] - 2026-03-28
- Add 2026-03-28 LinkedIn writing entry

## [v3.2.6] - 2026-03-22
- Add theme-aware web manifests
