# Green Shift Nigeria: Pitch

## One-liner

**Green Shift turns generator smoke, blocked drains and invisible daily habits into clear numbers and next steps for Nigerian homes and communities.**

## Tagline

> Turn smoke into sunlight.

---

## 30-second elevator pitch

Millions of Nigerian homes run petrol generators for hours every day. A typical 3 kVA generator burns about 242 litres a month: over ₦217,000 and almost 7 tonnes of CO₂ a year. Meanwhile, plastic-choked drains turn ordinary rain into floods. People know these are problems, but nobody shows them **how much, where, and what to do next**.

Green Shift does. In one page it shows your real generator cost and when solar pays for itself, ranks blocked drains by flood risk before the rain arrives, and measures the habits that add up. No sign-up, no app install, and no data leaves your browser.

---

## The problem

- **Energy:** unreliable grid power pushes households and small businesses onto petrol generators. The cost is spread across many small fuel purchases, so it is rarely added up, and the exhaust brings carbon monoxide, noise and soot right into homes.
- **Flooding:** plastic bottles, sachets and nylon block drainage channels. When heavy rain comes, the water has nowhere to go, causing flash floods, damaged goods and polluted waterways. Cleanup crews have no clear way to decide which drain matters most *today*.
- **Habits:** everyday choices (repairing instead of replacing, using a reusable bottle, washing in a basin) do make a difference, but the impact is invisible, so it is easy to skip.

**The gap is not awareness. It is actionable, measurable information.**

## Who it's for

- Households and small business owners who rely on generators
- Residents living near drainage channels in flood-prone cities
- LGA sanitation and environmental teams who dispatch cleanup crews
- Anyone who wants to see what their daily choices actually save

## The solution

| Module | Behaviour or system | How it moves it forward |
|---|---|---|
| **Power Shift** | Daily generator use | Converts hours and kVA into naira, litres, CO₂ and trees, then shows the solar break-even point on a 5-year chart |
| **DrainGuard** | Blocked storm drains | Residents report a drain; a transparent risk score combines blockage with the rain forecast and ranks where crews go first |
| **Loop & Lean** | Everyday habits | Shows water, energy, waste and CO₂ saved per week and per year, with an impact score |
| **Action checklist** | Household follow-through | Eight concrete steps with saved progress, from safe generator placement to comparing solar quotes |

## Why it's different

1. **Starts from real Nigerian systems**, not generic carbon calculators: naira, petrol prices, state-by-state sunshine, local cities.
2. **Every number is explainable.** The formulas are open and the assumptions are editable on the page.
3. **It ends with an action**, not just a statistic: dispatch a crew, get solar quotes, tick off a step.
4. **Works anywhere.** It's a static web page with no install, no account, no API key and no tracking, light enough to share on WhatsApp.
5. **Memorable.** Drag one slider and the whole city shifts from smoke to sunlight.

---

## Expected environmental benefit

Using the app's own model (3 kVA, 8 h/day, ₦900/L):

| Per household switching to solar | Per year |
|---|---|
| Petrol avoided | ≈ 2,900 litres |
| CO₂ avoided | ≈ 6.7 tonnes |
| Money saved after payback | ≈ ₦2.6 million |
| Payback time | ≈ 2.1 years |

At street scale, 100 such households avoid ≈ 670 tonnes of CO₂ a year.

**DrainGuard:** clearing drains *before* forecast storms keeps plastic out of rivers and reduces flood damage. In the demo, each cleared drain removes an estimated 3 kg of waste per % blocked and drops its risk to "Low".

**Loop & Lean:** for example, repairing three items a week instead of replacing them avoids ≈ 296 kg of waste and ≈ 328 kg of CO₂ a year.

*All figures are planning estimates from the stated assumptions, not measured results.*

---

## 2–3 minute demo script

1. **Open on the hero (0:00).** "This is a Nigerian street on generators." Drag the slider from Generator to Solar. The smoke clears, panels appear, and air quality goes from 182 to 36. "That's the shift we're building tools for."
2. **The problem (0:20).** Scroll to the three counters. "One ordinary home: 242 litres, ₦217,000 a month, 6.7 tonnes of CO₂ a year."
3. **Power Shift (0:40).** Change the state and drag hours from 8 to 12. Point at the verdict line and the break-even dot on the chart. "Solar pays for itself in about two years, then it's savings." Show the trees row and the street-impact meters.
4. **DrainGuard (1:20).** Pick *Awka — Zik Avenue*, click **use a sample scan**, type "plastic bottles blocking the culvert", and **Run risk assessment**. The scan animates, the risk comes back *Critical*, and the queue re-ranks. Toggle the rain forecast to dry to show the ranking change. Click **Dispatch crew**: the drain is cleared and the waste-removed counter goes up.
5. **Loop & Lean (2:10).** Tap *Reusable bottle*, then slide frequency up. The score ring and yearly savings animate.
6. **Close (2:30).** Tick a checklist item. "Every number is explained in the Story section, and every assumption is editable. Green Shift: one home, one drain, one habit at a time." Click **Shift the city to solar**.

---

## How it works (for judges)

- Plain HTML, CSS and JavaScript; no frameworks, no backend.
- Canvas animation for the city; SVG for the chart, rings and map.
- Calculations run instantly in the browser. Formulas are documented in `README.md`.
- Checklist progress is saved in the browser only.
- No AI and no API keys. The DrainGuard "scan" is a clearly labelled simulation; the risk score is a transparent formula.

## Tools used

HTML5 · CSS3 · Vanilla JavaScript · Canvas 2D · SVG · IntersectionObserver · Web Animations API · Google Fonts · Font Awesome

## Limitations (stated honestly)

- DrainGuard corridor data, rain timings and the photo scan are simulated.
- Fuel, sunshine and solar costs are estimates, not quotes; petrol prices are held flat.
- Health and air indicators are illustrative, not measurements.
- The Nigeria map is a simplified outline.

## Roadmap

1. **Real photo analysis** of drain blockage through a secure server, never exposing keys in the browser.
2. **Live rainfall forecasts** so the risk score uses real weather.
3. **Shared reporting** between residents and LGA sanitation teams, with cleanup history.
4. **New modules:** AquaWatch (water leaks), FoodLoop (surplus food rescue), ReBuild (repair network), MaterialMind (construction scrap marketplace).
5. **Pilot** with one market area and its LGA to measure response time and waste removed.

---

## Devpost submission checklist

- [ ] Project title: **Green Shift Nigeria**
- [ ] Tagline: *Turn smoke into sunlight.*
- [ ] Story sections: Inspiration · What it does · How we built it · Challenges · Accomplishments · What we learned · What's next (use the sections above)
- [ ] All team members added: *[names]*
- [ ] Demo video (follow the demo script above, 2–3 minutes)
- [ ] Source code link or zip, with `README.md` for build instructions
- [ ] Screenshots: hero (smoke and solar), Power Shift chart, DrainGuard radar, Loop & Lean ring
- [ ] Built with: HTML, CSS, JavaScript, Canvas, SVG
- [ ] Confirm all data shown is simulated or calculated and has permission to share

### Suggested Devpost story text

**Inspiration.** Every evening the same sound fills Nigerian streets: generators. And every rainy season the same drains overflow with plastic. We wanted a tool that makes these problems measurable and actionable, not just another awareness campaign.

**What it does.** Green Shift shows what your generator really costs and when solar pays back, ranks blocked drains by flood risk before the rain, and measures the impact of everyday habits, all in one page.

**How we built it.** Pure HTML, CSS and JavaScript, with a Canvas city that shifts from smoke to solar, SVG charts and a radar map, and transparent formulas anyone can inspect and edit.

**Challenges.** Keeping estimates honest and explainable; designing one interface that feels both serious and memorable; making it work on phones without any backend.

**Accomplishments.** A complete, working prototype with three tools, editable assumptions, and zero data collection.

**What we learned.** People act on numbers they understand. Showing ₦ and litres lands far harder than abstract CO₂ alone.

**What's next.** Real drain photo analysis, live weather, shared community reporting, and a pilot with a local LGA.
