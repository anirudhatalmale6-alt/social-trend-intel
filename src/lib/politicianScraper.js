// src/lib/politicianScraper.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { getFirestore, collection, writeBatch } from 'firebase-admin/firestore';

const CAPITOL_URL = process.env.CAPITOL_TRADES_URL || 'https://www.capitoltrades.com/politicians';

export async function scrapePoliticianTrades() {
  const res = await fetch(CAPITOL_URL, {
    headers: { 'User-Agent': 'TrendArbBot/1.0 (+https://yourdomain.com)' },
  });
  if (!res.ok) throw new Error(`Failed fetch ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const trades = [];
  $('table tbody tr').each((_, row) => {
    const cols = $(row).find('td');
    const trade = {
      politician: $(cols[0]).text().trim(),
      ticker: $(cols[1]).text().trim(),
      date: new Date($(cols[2]).text().trim()).toISOString(),
      type: $(cols[3]).text().trim() === 'Buy' ? 'Buy' : 'Sell',
      amount: $(cols[4]).text().trim(),
    };
    trades.push(trade);
  });
  // Store in Firestore
  const db = getFirestore();
  const batch = writeBatch(db);
  const collRef = collection(db, 'politicianTrades');
  trades.forEach((t) => {
    const docRef = collRef.doc();
    batch.set(docRef, t);
  });
  await batch.commit();
  return trades;
}
