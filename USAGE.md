# Social Trend Intel – Quick Start Guide

## 📦 Getting the App Running

1. **Install dependencies** (if you haven't already):
   ```bash
   cd /Users/dunnikarp/.gemini/antigravity/scratch/social-trend-intel
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at **http://localhost:3000** (or the network URL shown in the console).

## 🚀 Core Features

### 1️⃣ Copy‑Trading Dashboard
- Open **http://localhost:3000/copy-trading**.
- **Select a strategy bundle** from the left sidebar (Tech Buzz, Meme Stocks, Consumer Growth, Green Energy).
- The simulator will lazily create a virtual portfolio (starting with $10 000).
- Every 30 seconds the app pulls live trends from **/api/trends** and automatically applies them to the active portfolio.
- The **PortfolioChart** displays your simulated capital over time.
- Portfolio state is persisted to `data/portfolios.json`, so refreshing the page retains your progress.

### 2️⃣ Market‑Research SaaS
- Open **http://localhost:3000/market-research**.
- Use the **sector selector** to filter trends (All, Technology, Health, Consumer, Energy, Finance).
- Observe the **SectorHeatMap** visualisation and the **Top Trends** table.
- Click **"Export PDF"** to download a printable research report (client‑side, uses html2canvas + jsPDF).

## 🔌 API Endpoints (for developers)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trends` | **GET** | Returns the latest aggregated trends (used by both dashboards). |
| `/api/portfolio?bundleId=<id>` | **GET** | Retrieves (and lazily creates) the persisted portfolio for the specified strategy bundle. |
| `/api/reddit` | **GET** | Proxy to the live Reddit trends source (used internally). |

## 📁 Project Structure (high‑level)
- `app/` – Next.js pages (`copy‑trading`, `market‑research`).
- `components/` – UI components (cards, charts, heat‑map, PDF export). 
- `lib/`
  - `strategyBundles.ts` – static bundle definitions.
  - `portfolioSimulator.ts` – async simulator with persistence.
  - `persistence.ts` – thin JSON file read/write layer.
  - `type.ts` – shared `Trend` interface.
- `data/portfolios.json` – automatically created file storing portfolio state.
- `tests/` – Jest tests for the simulator.

## 🛠️ Development Tips
- The simulator functions (`initPortfolio`, `applyTrend`, `getPortfolioState`) are **async** – remember to `await` them when calling from custom code.
- To reset all persisted data, simply delete the `data/portfolios.json` file (or the entire `data` folder). The app will recreate it on next request.
- The UI uses a dark glass‑morphism theme; feel free to tweak the design tokens in `app/globals.css`.

## 📖 Further Reading
- **Portfolio API** source: `[portfolio API](/app/api/portfolio/route.ts)`
- **Copy‑Trading page** source: `[Copy‑Trading page](/app/copy-trading/page.tsx)`
- **Market‑Research page** source: `[Market‑Research page](/app/market-research/page.tsx)`
- **Persistence layer** source: `[Persistence module](/lib/persistence.ts)`

---
Enjoy experimenting with social‑trend‑driven copy‑trading! If you need help adding authentication, Stripe integration, or deployment, just let me know. 🚀
