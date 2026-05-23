# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AEX AI Advisor** is a private single-page mobile web app that fetches live AEX stock data and surfaces a technical trading signal (best setup of the moment) for 4 Dutch stocks: ASML, Adyen, ING Groep, and Shell. It is a fully static app with no build step, no package manager, and no test framework.

## Deployment

The app is deployed as a static site via **Vercel** (`vercel.json` routes everything to `index.html`). To deploy, push to the connected GitHub repository; Vercel picks up changes automatically.

There are no local dev commands. Open `index.html` directly in a browser, or use any static server (e.g. `python3 -m http.server`).

## Architecture

Everything lives in a single file: **`index.html`** — HTML, CSS, and JavaScript are all inline. There is no build tooling, no npm, no bundler.

### Data Flow

1. On load (and every 15 minutes), `scan()` is called.
2. For each stock in `STOCKS`, `getStock()` fetches the last 30 hourly candles from the **Twelve Data API** (`/time_series`).
3. Each stock is scored with `score()`, which combines four signals:
   - **Trend** (34%) — price change relative to 30-hour open, normalised 0–100
   - **Momentum** (36%) — last tick change, normalised 0–100
   - **RSI score** (12%) — 14-period RSI, scored for proximity to 55 (sweet spot)
   - **Volume** (18%) — recent 5-bar avg vs older 12-bar avg, normalised 0–100
4. The highest-scoring stock is rendered as "beste setup nu" with entry/stop/target levels derived from simple price multipliers (`×0.995/×1.008` entry, `×0.965` stop, `×1.045` target).
5. Results are cached in `localStorage` under the key `aex-live-cache` for 15 minutes to stay within Twelve Data's free-tier rate limits.

### API Key

The Twelve Data API key is **hardcoded** in `index.html` as `const API_KEY='...'`. This is intentional for a private-use static app with no backend; be aware it is public in the source.

### UI / Styling

- The UI is designed for portrait mobile with a fixed 3-row grid (`54px / 1fr / 104px`).
- CSS variables are defined in `:root`: `--cyan`, `--green`, `--red`, `--gold`, `--bg`, `--panel`.
- Landscape mode is handled with an `@media (orientation:landscape)` override.
- The app uses `dvh` units and `env(safe-area-inset-*)` for iOS notch/home-bar support.
- It can be installed as a PWA-like home-screen app on iOS (`apple-mobile-web-app-capable`).

### Pattern Detection

`getStock()` classifies each stock into one of four patterns based on trend/momentum/RSI thresholds:

| Pattern | Condition |
|---|---|
| Bullish Breakout | trend > 68 && momentum > 58 |
| Pullback Kans | trend > 55 && RSI < 62 |
| Momentum Spike | momentum > 70 |
| Range Watch | (fallback) |

### Localisation

The app UI is in Dutch (`lang="nl"`). Numbers use `nl-NL` locale formatting for euros.
