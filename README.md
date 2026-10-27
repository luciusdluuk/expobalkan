# ExpoBalkan — website prototype

Business news platform for economy, finance, production and energy across the Western Balkans.

- **ExpoBalkan Adria** — the regional front page (all editions)
- **Editions** — Bosnia & Herzegovina (BIH), Serbia (SRB), Montenegro (MNE), North Macedonia (MKD). Same design, content filtered to that country. Chosen from the menu (EB icon + code).
- **Masthead** — menu, search, popular, latest, newsletter on the left; type logo in the middle; subscribe and MNE/EN on the right.
- **Languages** — Montenegrin (MNE) and English (EN) everywhere; Macedonian (MK, Cyrillic) on the North Macedonia edition. Switch at the top right. White/dark switch is in the menu.

## Run it

It is a static site with no build step. Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

To publish with GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell: top bar, masthead, edition rail, section nav, main, newsletter, footer, menu drawer |
| `styles.css` | Design tokens (colours, type), layout, light and dark theme, edition colours |
| `data.js` | Editions, sections, market strip and all articles in MNE + EN |
| `i18n-mk.js` | Macedonian translations: interface, editions, sections and every article |
| `app.js` | Routing, rendering, hero carousel, menu drawer, language switch |

## Routes

| URL | Page |
|---|---|
| `#adria` | Regional front page |
| `#bih` `#srb` `#mne` `#mkd` | Edition front page |
| `#mne-econ` | Section within an edition (`econ`, `fin`, `prod`, `energy`, `markets`, `biz`) |
| `#mne-popular` | Most read in an edition |
| `#mne-latest` | All latest stories in an edition |
| `#mne-subscribe` | Subscription plans |
| `#story-m1` | Article |

## Adding a story

Add an object to `articles` in `data.js`:

```js
{ id: "m7", ed: "mne", sec: "fin", mins: 30, featured: true,
  fig: { v: "€85m", me: "Vrijednost investicije", en: "Investment value" },
  me: { t: "Naslov na crnogorskom", d: "Kratak uvod." },
  en: { t: "Headline in English", d: "Short standfirst." } }
```

`featured: true` puts it in the rotating carousel. `fig` is the headline number shown on the cover graphic.

## Brand

- Logo: ExpoBalkan wordmark in Inter (Neue Haas direction) with the EB icon.
- Edition colours come from the EB icon set: Adria neutral, BIH blue/yellow, SRB red/blue, MNE crimson/gold, MKD red/yellow.

Photos are from Unsplash (free under the Unsplash License) and are credited on each story. All article content is sample content for the prototype.
