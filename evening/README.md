# Sapphir & Matthew — Evening Guests

An information website for **evening guests** at Sapphir & Matthew's wedding
(Saturday 20th February 2027, Hellaby Hall). It is the companion to the
day-guest RSVP site, but with no RSVP form — just everything evening guests
need to know.

## Sections

1. **Hero** — names, date and evening start time
2. **Key Information** — dress code, cashless venue, gifts / honeymoon fund
3. **The Evening** — timeline from 7:00 PM arrival to midnight departure
4. **Venue** — Hellaby Hall details, address and directions
5. **Travel & Accommodation** — car, train and hotel booking info

## Files

- `index.html` — page content
- `styles.css` — styling (same palette and fonts as the day site, with a darker evening theme)
- `script.js` — fairy-light animation, nav scroll effect and scroll reveal

## Running locally

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Hosting

It's a static site, so GitHub Pages works out of the box:
**Settings → Pages → Deploy from a branch → `main` / root**.

## Moving this into its own repository

This folder is fully self-contained. To give it its own repo:

1. Create a new empty repository on GitHub (e.g. `rsvp-evening`).
2. Copy the four files in this folder (`index.html`, `styles.css`, `script.js`, `README.md`) into the root of it.
3. Enable GitHub Pages as above.

Until then, once merged it is also served from the existing site at `/evening/`.
