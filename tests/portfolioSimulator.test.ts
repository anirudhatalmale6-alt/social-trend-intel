// tests/portfolioSimulator.test.ts
import {
  initPortfolio,
  applyTrend,
  getPortfolioState,
  getAllPortfolios
} from "../lib/portfolioSimulator";
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "portfolios.json");

function cleanData() {
  if (fs.existsSync(FILE_PATH)) {
    fs.unlinkSync(FILE_PATH);
  }
  if (fs.existsSync(DATA_DIR)) {
    fs.rmdirSync(DATA_DIR);
  }
}

describe("Portfolio Simulator with persistence", () => {
  beforeAll(() => {
    cleanData();
  });

  afterAll(() => {
    cleanData();
  });

  test("initPortfolio creates a new portfolio and persists it", async () => {
    const state = await initPortfolio("tech-buzz");
    expect(state).toBeDefined();
    expect(state.capital).toBe(10000);
    expect(state.history).toHaveLength(1);
    expect(fs.existsSync(FILE_PATH)).toBe(true);
    const fileContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    expect(fileContent["tech-buzz"]).toBeDefined();
  });

  test("applyTrend updates capital proportionally and persists", async () => {
    const trend = { score: 80, tickers: ["NVDA", "AMD"] };
    const before = await getPortfolioState("tech-buzz");
    const beforeCapital = before!.capital;
    await applyTrend("tech-buzz", trend);
    const after = await getPortfolioState("tech-buzz");
    expect(after!.capital).toBeGreaterThan(beforeCapital);
    const fileContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    expect(fileContent["tech-buzz"].capital).toBe(after!.capital);
  });

  test("getAllPortfolios returns all persisted portfolios", async () => {
    const all = await getAllPortfolios();
    expect(all.length).toBeGreaterThanOrEqual(1);
    const tech = all.find(p => p.bundleId === "tech-buzz");
    expect(tech).toBeDefined();
  });
});
