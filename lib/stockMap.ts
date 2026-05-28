export interface StockMapping {
  ticker: string;
  company: string;
  sector: string;
  exchange: string;
}

export const KEYWORD_STOCK_MAP: Record<string, StockMapping[]> = {
  // AI & Chips
  "ai": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }, { ticker: "GOOGL", company: "Alphabet", sector: "Technology", exchange: "NASDAQ" }],
  "artificial intelligence": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }, { ticker: "AMD", company: "AMD", sector: "Technology", exchange: "NASDAQ" }],
  "chip": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "AMD", company: "AMD", sector: "Technology", exchange: "NASDAQ" }, { ticker: "INTC", company: "Intel", sector: "Technology", exchange: "NASDAQ" }],
  "semiconductor": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "AMD", company: "AMD", sector: "Technology", exchange: "NASDAQ" }, { ticker: "AVGO", company: "Broadcom", sector: "Technology", exchange: "NASDAQ" }, { ticker: "TSM", company: "TSMC", sector: "Technology", exchange: "NYSE" }],
  "gpu": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "AMD", company: "AMD", sector: "Technology", exchange: "NASDAQ" }],
  "chatgpt": [{ ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }, { ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }],
  "llm": [{ ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }, { ticker: "GOOGL", company: "Alphabet", sector: "Technology", exchange: "NASDAQ" }, { ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }],
  "openai": [{ ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }],
  "gemini": [{ ticker: "GOOGL", company: "Alphabet", sector: "Technology", exchange: "NASDAQ" }],
  "claude": [{ ticker: "AMZN", company: "Amazon", sector: "Technology", exchange: "NASDAQ" }],

  // EV & Clean Energy
  "electric vehicle": [{ ticker: "TSLA", company: "Tesla", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "GM", company: "General Motors", sector: "Consumer Cyclical", exchange: "NYSE" }, { ticker: "F", company: "Ford", sector: "Consumer Cyclical", exchange: "NYSE" }, { ticker: "RIVN", company: "Rivian", sector: "Consumer Cyclical", exchange: "NASDAQ" }],
  "ev": [{ ticker: "TSLA", company: "Tesla", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "RIVN", company: "Rivian", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "LCID", company: "Lucid", sector: "Consumer Cyclical", exchange: "NASDAQ" }],
  "tesla": [{ ticker: "TSLA", company: "Tesla", sector: "Consumer Cyclical", exchange: "NASDAQ" }],
  "battery": [{ ticker: "TSLA", company: "Tesla", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "QCLN", company: "Clean Energy ETF", sector: "Energy", exchange: "NASDAQ" }, { ticker: "ALB", company: "Albemarle", sector: "Materials", exchange: "NYSE" }],
  "solar": [{ ticker: "ENPH", company: "Enphase", sector: "Energy", exchange: "NASDAQ" }, { ticker: "SEDG", company: "SolarEdge", sector: "Energy", exchange: "NASDAQ" }, { ticker: "FSLR", company: "First Solar", sector: "Energy", exchange: "NASDAQ" }],
  "lithium": [{ ticker: "ALB", company: "Albemarle", sector: "Materials", exchange: "NYSE" }, { ticker: "LAC", company: "Lithium Americas", sector: "Materials", exchange: "NYSE" }],

  // Health & Pharma
  "weight loss": [{ ticker: "LLY", company: "Eli Lilly", sector: "Healthcare", exchange: "NYSE" }, { ticker: "NVO", company: "Novo Nordisk", sector: "Healthcare", exchange: "NYSE" }],
  "ozempic": [{ ticker: "NVO", company: "Novo Nordisk", sector: "Healthcare", exchange: "NYSE" }],
  "wegovy": [{ ticker: "NVO", company: "Novo Nordisk", sector: "Healthcare", exchange: "NYSE" }],
  "mounjaro": [{ ticker: "LLY", company: "Eli Lilly", sector: "Healthcare", exchange: "NYSE" }],
  "glp-1": [{ ticker: "LLY", company: "Eli Lilly", sector: "Healthcare", exchange: "NYSE" }, { ticker: "NVO", company: "Novo Nordisk", sector: "Healthcare", exchange: "NYSE" }],
  "cancer": [{ ticker: "MRK", company: "Merck", sector: "Healthcare", exchange: "NYSE" }, { ticker: "BMY", company: "Bristol-Myers", sector: "Healthcare", exchange: "NYSE" }, { ticker: "REGN", company: "Regeneron", sector: "Healthcare", exchange: "NASDAQ" }],
  "drug": [{ ticker: "JNJ", company: "J&J", sector: "Healthcare", exchange: "NYSE" }, { ticker: "PFE", company: "Pfizer", sector: "Healthcare", exchange: "NYSE" }, { ticker: "ABBV", company: "AbbVie", sector: "Healthcare", exchange: "NYSE" }],
  "vaccine": [{ ticker: "PFE", company: "Pfizer", sector: "Healthcare", exchange: "NYSE" }, { ticker: "MRNA", company: "Moderna", sector: "Healthcare", exchange: "NASDAQ" }, { ticker: "BNTX", company: "BioNTech", sector: "Healthcare", exchange: "NASDAQ" }],
  "mental health": [{ ticker: "LLY", company: "Eli Lilly", sector: "Healthcare", exchange: "NYSE" }, { ticker: "ABBV", company: "AbbVie", sector: "Healthcare", exchange: "NYSE" }],
  "biotech": [{ ticker: "BIIB", company: "Biogen", sector: "Healthcare", exchange: "NASDAQ" }, { ticker: "GILD", company: "Gilead", sector: "Healthcare", exchange: "NASDAQ" }],

  // Social Media & Tech
  "tiktok": [{ ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }, { ticker: "SNAP", company: "Snap", sector: "Technology", exchange: "NYSE" }, { ticker: "GOOGL", company: "Alphabet", sector: "Technology", exchange: "NASDAQ" }],
  "instagram": [{ ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }],
  "facebook": [{ ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }],
  "twitter": [{ ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }],
  "streaming": [{ ticker: "NFLX", company: "Netflix", sector: "Technology", exchange: "NASDAQ" }, { ticker: "DIS", company: "Disney", sector: "Communication", exchange: "NYSE" }, { ticker: "PARA", company: "Paramount", sector: "Communication", exchange: "NASDAQ" }],
  "netflix": [{ ticker: "NFLX", company: "Netflix", sector: "Technology", exchange: "NASDAQ" }],
  "apple": [{ ticker: "AAPL", company: "Apple", sector: "Technology", exchange: "NASDAQ" }],
  "iphone": [{ ticker: "AAPL", company: "Apple", sector: "Technology", exchange: "NASDAQ" }],
  "vision pro": [{ ticker: "AAPL", company: "Apple", sector: "Technology", exchange: "NASDAQ" }],
  "vr": [{ ticker: "META", company: "Meta", sector: "Technology", exchange: "NASDAQ" }, { ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }],
  "cloud": [{ ticker: "AMZN", company: "Amazon", sector: "Technology", exchange: "NASDAQ" }, { ticker: "MSFT", company: "Microsoft", sector: "Technology", exchange: "NASDAQ" }, { ticker: "GOOGL", company: "Alphabet", sector: "Technology", exchange: "NASDAQ" }],
  "cybersecurity": [{ ticker: "CRWD", company: "CrowdStrike", sector: "Technology", exchange: "NASDAQ" }, { ticker: "PANW", company: "Palo Alto", sector: "Technology", exchange: "NASDAQ" }, { ticker: "ZS", company: "Zscaler", sector: "Technology", exchange: "NASDAQ" }],
  "hack": [{ ticker: "CRWD", company: "CrowdStrike", sector: "Technology", exchange: "NASDAQ" }, { ticker: "PANW", company: "Palo Alto", sector: "Technology", exchange: "NASDAQ" }],

  // Retail & Consumer
  "amazon": [{ ticker: "AMZN", company: "Amazon", sector: "Technology", exchange: "NASDAQ" }],
  "walmart": [{ ticker: "WMT", company: "Walmart", sector: "Consumer Defensive", exchange: "NYSE" }],
  "target": [{ ticker: "TGT", company: "Target", sector: "Consumer Defensive", exchange: "NYSE" }],
  "costco": [{ ticker: "COST", company: "Costco", sector: "Consumer Defensive", exchange: "NASDAQ" }],
  "nike": [{ ticker: "NKE", company: "Nike", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "luxury": [{ ticker: "LVMH", company: "LVMH", sector: "Consumer Cyclical", exchange: "OTC" }, { ticker: "TPR", company: "Tapestry", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "stanley cup": [{ ticker: "PMTS", company: "Pacific Market", sector: "Consumer Cyclical", exchange: "OTC" }],
  "coffee": [{ ticker: "SBUX", company: "Starbucks", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "KDP", company: "Keurig Dr Pepper", sector: "Consumer Defensive", exchange: "NASDAQ" }],
  "fast food": [{ ticker: "MCD", company: "McDonald's", sector: "Consumer Cyclical", exchange: "NYSE" }, { ticker: "CMG", company: "Chipotle", sector: "Consumer Cyclical", exchange: "NYSE" }, { ticker: "YUM", company: "Yum! Brands", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "chipotle": [{ ticker: "CMG", company: "Chipotle", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "mcdonald": [{ ticker: "MCD", company: "McDonald's", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "food delivery": [{ ticker: "DASH", company: "DoorDash", sector: "Technology", exchange: "NASDAQ" }, { ticker: "UBER", company: "Uber", sector: "Technology", exchange: "NYSE" }],
  "doordash": [{ ticker: "DASH", company: "DoorDash", sector: "Technology", exchange: "NASDAQ" }],

  // Finance & Crypto
  "bitcoin": [{ ticker: "MSTR", company: "MicroStrategy", sector: "Technology", exchange: "NASDAQ" }, { ticker: "COIN", company: "Coinbase", sector: "Finance", exchange: "NASDAQ" }, { ticker: "IBIT", company: "iShares Bitcoin ETF", sector: "Finance", exchange: "NASDAQ" }],
  "crypto": [{ ticker: "COIN", company: "Coinbase", sector: "Finance", exchange: "NASDAQ" }, { ticker: "MSTR", company: "MicroStrategy", sector: "Technology", exchange: "NASDAQ" }],
  "ethereum": [{ ticker: "COIN", company: "Coinbase", sector: "Finance", exchange: "NASDAQ" }],
  "fintech": [{ ticker: "SQ", company: "Block", sector: "Finance", exchange: "NYSE" }, { ticker: "PYPL", company: "PayPal", sector: "Finance", exchange: "NASDAQ" }, { ticker: "SOFI", company: "SoFi", sector: "Finance", exchange: "NASDAQ" }],
  "bank": [{ ticker: "JPM", company: "JPMorgan Chase", sector: "Finance", exchange: "NYSE" }, { ticker: "BAC", company: "Bank of America", sector: "Finance", exchange: "NYSE" }, { ticker: "GS", company: "Goldman Sachs", sector: "Finance", exchange: "NYSE" }],
  "interest rate": [{ ticker: "TLT", company: "20+ Year Treasury ETF", sector: "Finance", exchange: "NASDAQ" }, { ticker: "JPM", company: "JPMorgan", sector: "Finance", exchange: "NYSE" }],
  "inflation": [{ ticker: "GLD", company: "Gold ETF", sector: "Commodities", exchange: "NYSE" }, { ticker: "TIP", company: "TIPS ETF", sector: "Finance", exchange: "NYSE" }],

  // Space & Defense
  "space": [{ ticker: "RKLB", company: "Rocket Lab", sector: "Industrials", exchange: "NASDAQ" }, { ticker: "SPCE", company: "Virgin Galactic", sector: "Industrials", exchange: "NYSE" }, { ticker: "LMT", company: "Lockheed Martin", sector: "Defense", exchange: "NYSE" }],
  "spacex": [{ ticker: "RKLB", company: "Rocket Lab", sector: "Industrials", exchange: "NASDAQ" }],
  "drone": [{ ticker: "ACHR", company: "Archer Aviation", sector: "Industrials", exchange: "NYSE" }, { ticker: "JOBY", company: "Joby Aviation", sector: "Industrials", exchange: "NYSE" }],
  "defense": [{ ticker: "LMT", company: "Lockheed Martin", sector: "Defense", exchange: "NYSE" }, { ticker: "RTX", company: "Raytheon", sector: "Defense", exchange: "NYSE" }, { ticker: "NOC", company: "Northrop Grumman", sector: "Defense", exchange: "NYSE" }],

  // Travel & Hospitality
  "travel": [{ ticker: "BKNG", company: "Booking", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "ABNB", company: "Airbnb", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "EXPE", company: "Expedia", sector: "Consumer Cyclical", exchange: "NASDAQ" }],
  "airline": [{ ticker: "DAL", company: "Delta", sector: "Industrials", exchange: "NYSE" }, { ticker: "UAL", company: "United", sector: "Industrials", exchange: "NASDAQ" }, { ticker: "AAL", company: "American", sector: "Industrials", exchange: "NASDAQ" }],
  "airbnb": [{ ticker: "ABNB", company: "Airbnb", sector: "Consumer Cyclical", exchange: "NASDAQ" }],
  "cruise": [{ ticker: "CCL", company: "Carnival", sector: "Consumer Cyclical", exchange: "NYSE" }, { ticker: "RCL", company: "Royal Caribbean", sector: "Consumer Cyclical", exchange: "NYSE" }],
  "hotel": [{ ticker: "MAR", company: "Marriott", sector: "Consumer Cyclical", exchange: "NASDAQ" }, { ticker: "HLT", company: "Hilton", sector: "Consumer Cyclical", exchange: "NYSE" }],

  // Gaming & Entertainment
  "gaming": [{ ticker: "NVDA", company: "NVIDIA", sector: "Technology", exchange: "NASDAQ" }, { ticker: "ATVI", company: "Activision", sector: "Technology", exchange: "NASDAQ" }, { ticker: "EA", company: "Electronic Arts", sector: "Technology", exchange: "NASDAQ" }, { ticker: "RBLX", company: "Roblox", sector: "Technology", exchange: "NYSE" }],
  "roblox": [{ ticker: "RBLX", company: "Roblox", sector: "Technology", exchange: "NYSE" }],
  "esports": [{ ticker: "SKLZ", company: "Skillz", sector: "Technology", exchange: "NYSE" }],
  "disney": [{ ticker: "DIS", company: "Disney", sector: "Communication", exchange: "NYSE" }],
};

export const SECTOR_COLORS: Record<string, string> = {
  "Technology": "#6c63ff",
  "Healthcare": "#00d4aa",
  "Consumer Cyclical": "#ffa726",
  "Consumer Defensive": "#66bb6a",
  "Finance": "#42a5f5",
  "Energy": "#ff7043",
  "Materials": "#ab47bc",
  "Industrials": "#78909c",
  "Defense": "#ef5350",
  "Communication": "#26c6da",
  "Commodities": "#d4a017",
};

export function mapKeywordsToStocks(keywords: string[]): StockMapping[] {
  const seen = new Set<string>();
  const results: StockMapping[] = [];

  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    for (const [mapKey, stocks] of Object.entries(KEYWORD_STOCK_MAP)) {
      if (lower.includes(mapKey) || mapKey.includes(lower)) {
        for (const stock of stocks) {
          if (!seen.has(stock.ticker)) {
            seen.add(stock.ticker);
            results.push(stock);
          }
        }
      }
    }
  }

  return results.slice(0, 6);
}
