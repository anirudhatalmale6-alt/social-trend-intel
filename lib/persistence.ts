// lib/persistence.ts
import { promises as fs } from "fs";
import path from "path";
import { PortfolioState } from "./portfolioSimulator";

const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "portfolios.json");

/** Ensure the data directory exists */
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore if already exists
  }
}

/** Load all persisted portfolios */
export async function loadPortfolios(): Promise<Record<string, PortfolioState>> {
  await ensureDir();
  try {
    const content = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(content) as Record<string, PortfolioState>;
  } catch (e) {
    // If file missing or malformed, start fresh
    return {};
  }
}

/** Save the given portfolios map */
export async function savePortfolios(portfolios: Record<string, PortfolioState>) {
  await ensureDir();
  await fs.writeFile(FILE_PATH, JSON.stringify(portfolios, null, 2), "utf-8");
}
