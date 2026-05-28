import React, { useEffect, useState, useCallback } from 'react';

interface Market {
  id: string;
  title: string;
  url: string;
  // Assuming the API returns a `price` field; fallback to 0 if missing
  price?: number;
}

const PolymarketList: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchMarkets = useCallback(async () => {
    try {
      const response = await fetch('/api/polymarket');
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      const raw = Array.isArray(data) ? data : data.markets ?? [];
      const marketsList: Market[] = raw.map((m: any) => ({
        id: m.id?.toString() ?? '',
        title: m.title ?? m.question ?? 'Untitled Market',
        url: m.url ?? `https://polymarket.com/market/${m.id}`,
        price: m.price ?? (m.prices?.[0]?.price ?? 0),
      }));
      setMarkets(marketsList);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch Polymarket data:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    const intervalId = setInterval(fetchMarkets, 30000);
    return () => clearInterval(intervalId);
  }, [fetchMarkets]);

  if (loading && markets.length === 0) return <p className="polymarket-loading">Loading markets…</p>;
  if (error && markets.length === 0) return <p className="polymarket-error">Error: {error}</p>;

  return (
    <div className="polymarket-container">
      {markets.map((market) => (
        <a
          key={market.id}
          href={market.url}
          target="_blank"
          rel="noopener noreferrer"
          className="polymarket-card"
        >
          <h3 className="polymarket-title">{market.title}</h3>
          {market.price !== undefined && (
            <p className="polymarket-price">Current price: {typeof market.price === 'number' ? market.price.toFixed(2) : market.price}</p>
          )}
        </a>
      ))}
    </div>
  );
};

export default PolymarketList;
