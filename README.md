# Green Shift Nigeria

**Turn smoke into sunlight.** Green Shift is a browser-based prototype that helps Nigerian households, residents and sanitation teams turn everyday environmental problems into clear numbers and next steps.

Built for **Green Shift Hacks**.

---

## What it does

Green Shift combines three working tools on one page:

| Module | Problem it targets | What the user gets |
|---|---|---|
| **Power Shift** | Homes and shops running petrol generators for hours every day | Monthly fuel cost, litres burned, yearly CO₂, solar payback time, and a 5-year cost chart |
| **DrainGuard** | Plastic-blocked drains that turn heavy rain into flash floods | A flood-risk radar that ranks drains by blockage and rain forecast, and a crew dispatch flow |
| **Loop & Lean** | Small daily habits whose impact is invisible | Water, energy, waste and CO₂ saved per week and per year for six everyday choices |

It also includes a household action checklist, generator safety guidance, and a project story section.

---

## How to run it

No install, build step, account or API key is needed.

1. Download or clone this folder.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

An internet connection is only used to load Google Fonts and Font Awesome icons. Without it the page still works, with fallback fonts.

To host it, upload the folder to any static host (GitHub Pages, Netlify, Vercel). There is no backend.

---

## Project structure

```
enviromental control project/
├── index.html                 # Page structure and content
├── assets/
│   ├── styles/main.css        # All styling, layout and animations
│   ├── scripts/main.js        # All behaviour, calculators and simulations
│   └── images/
│       ├── thumbnail.png      # Devpost thumbnail (1200×800, 3:2)
│       └── thumbnail.html     # Editable source for the thumbnail
├── README.md                  # This file
└── PITCH.md                   # Pitch, demo script and Devpost story
```

The older HTML files in the folder are earlier drafts that this page combines and replaces.

---

## How each part works

### 1. Hero: the city shift

A `<canvas>` draws a Nigerian skyline. The slider controls one value, `shift` (0 = generator, 1 = solar), which blends:

- sky colour from smoky brown to clear blue
- smoke puffs from rooftops (fewer as `shift` rises)
- solar panels on roofs, light motes and birds (more as `shift` rises)

The readings beside it (air quality, street noise, neighbourhood CO₂) follow the same value. **They are illustrative, not measured.** The Smoke/Solar switch in the top bar animates the slider for you.

### 2. Power Shift calculator

Inputs: state, generator size (kVA), hours per day, petrol price per litre.

```
energy per day (kWh)   = kVA × load factor (0.48) × hours
litres per month       = energy per day × 0.7 L/kWh × 30
fuel cost per month    = litres per month × petrol price
CO₂ per year (kg)      = litres per month × 12 × 2.31 kg/L
trees to absorb it     = CO₂ per year ÷ 21 kg per tree
solar system cost      = energy per day × ₦450,000 × (0.5 + 2.5 ÷ peak sun hours)
payback (months)       = solar system cost ÷ fuel cost per month
```

Peak sun hours come from four broad regions (6.2 h in the far north down to 4.5 h on the coast). Every assumption can be edited in **Story → Assumptions you can change**, and all results update live.

**Example (defaults):** a 3 kVA generator, 8 h/day, ₦900/L in Lagos:
≈ 242 L/month · ₦217,728/month · 6,706 kg CO₂/year · solar pays back in ≈ 2.1 years and saves ≈ ₦7.59 million by year five.

The "what the smoke does" meters (clean air, street-tree vitality, breathing comfort) scale with generator size × hours. They are illustrative indicators to make the impact tangible, not health measurements.

### 3. DrainGuard

Five sample corridors (Awka, Lagos, Ibadan, Port Harcourt, Kano) are plotted on a stylised SVG map of Nigeria.

```
rain factor = 1 − (hours until rain ÷ 24)        (× 0.25 when the forecast is dry)
risk (0–10) = blockage % × 6.5 + rain factor × 3.5
```

| Risk | Level |
|---|---|
| 8.0 and above | Critical |
| 6.5 – 7.9 | High |
| 4.0 – 6.4 | Moderate |
| below 4.0 | Low |

**Flow:**
1. Pick a corridor, add a photo (or use the sample), set the observed blockage, and add notes.
2. **Run risk assessment** plays a scan animation, then recalculates the risk and shows a recommendation. Words like *plastic*, *bottle*, *nylon* or *sachet* in the notes change the reported waste mix.
3. The priority queue re-ranks automatically. The rain toggle shows how the forecast changes urgency.
4. **Dispatch crew** sends a crew, then marks the drain cleared, cuts its risk, and adds the waste removed (≈ 3 kg per % blockage) to the running totals.

> The photo is only displayed, never analysed or uploaded. The corridor data is simulated for demonstration.

### 4. Loop & Lean

Each habit has a per-action value for water (L), energy (kWh), waste (kg) and CO₂ (kg). The results are:

```
weekly = per-action value × times per week
yearly = weekly × 52
score  = min(99, base score × 0.75 + times per week × 2)
```

Habits: repair instead of replace, cold-water laundry, shorter shower, reusable bottle, bring your own container, wash dishes in a basin.

### 5. Action checklist

Eight practical steps (generator placement, fuel safety, wiring, tracking use, cutting waste, reporting a drain, comparing solar quotes, saving emergency contacts). Progress is saved in the browser's `localStorage`, so it persists on that device only. Completing all eight triggers a celebration.

---

## Privacy and data

- No AI service, no API key, no backend, no analytics or tracking.
- Nothing typed or uploaded leaves the browser.
- The only stored data is checklist progress, kept locally in the user's browser.

---

## Tools used

- HTML5, CSS3 and vanilla JavaScript (no frameworks)
- Canvas 2D for the animated city scene
- Inline SVG for the cost chart, score rings and DrainGuard map
- IntersectionObserver for scroll animations; Web Animations API for confetti
- Google Fonts (Bricolage Grotesque, Figtree, JetBrains Mono) and Font Awesome 6.4 icons

Accessibility: keyboard-focusable controls, ARIA labels on interactive elements, live regions for updated results, and reduced animation when the user's system requests it. The layout is responsive down to small phones.

---

## Limitations

- DrainGuard corridors, rain timings and the photo "scan" are simulated.
- Fuel use, sunshine hours and solar costs are planning estimates, not quotes.
- Petrol prices are held flat for five years; maintenance, battery replacement and grid supply are not included.
- CO₂ uses a standard tailpipe factor and ignores solar equipment life-cycle emissions.
- Health and air indicators are illustrative.
- The map outline of Nigeria is simplified.

## Next steps

- Real image analysis of drain photos (via a secure backend, never a key in the browser)
- Live rainfall forecasts from a weather API
- Shared reports so residents and LGA teams see the same map
- AquaWatch (leak reporting), FoodLoop (surplus food rescue), ReBuild (repair network) and MaterialMind (scrap marketplace)

---

## Credits

Built by *[team names]* for Green Shift Hacks. Data shown is simulated or calculated from the stated assumptions and is free to share.
