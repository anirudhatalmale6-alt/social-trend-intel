// src/models/PoliticianTrade.ts
export interface PoliticianTrade {
  politician: string;
  ticker: string;
  date: string; // ISO string
  type: 'Buy' | 'Sell';
  amount: string;
}
