import YahooFinance from "yahoo-finance2";
import { getCache, setCache } from "./cache";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export type YahooQuote = {
  cmp: number | null;
  marketState: string | null;
  lastTradeTime: number | null;
  peRatio: number | null;
  earnings: number | null;
};

async function getChartQuote(symbol: string): Promise<YahooQuote | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("status " + res.status);

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;

    // The chart API has no marketState, so work it out from today's trading period
    const now = Date.now() / 1000;
    const period = meta.currentTradingPeriod?.regular;
    const isRegular = period && now >= period.start && now < period.end;

    return {
      cmp: meta.regularMarketPrice,
      marketState: isRegular ? "REGULAR" : "CLOSED",
      lastTradeTime: meta.regularMarketTime ? meta.regularMarketTime * 1000 : null,
      peRatio: null,
      earnings: null,
    };
  } catch (err) {
    console.log("yahoo chart error:", symbol, err);
    return null;
  }
}

export async function getYahooQuotes(symbols: string[]) {
  const cached = getCache<Record<string, YahooQuote>>("yahoo");
  if (cached) return cached;

  const result: Record<string, YahooQuote> = {};

  try {
    const quotes = await yahooFinance.quote(symbols);
    for (const q of quotes) {
      result[q.symbol] = {
        cmp: q.regularMarketPrice ?? null,
        marketState: q.marketState ?? null,
        lastTradeTime: q.regularMarketTime ? new Date(q.regularMarketTime).getTime() : null,
        peRatio: q.trailingPE ?? null,
        earnings: q.epsTrailingTwelveMonths ?? null,
      };
    }
  } catch (err) {
    console.log("yahoo error:", err);
  }

  // The quote API needs a login crumb that Yahoo often blocks on cloud servers,
  // so get any missing symbols from the chart API, which doesn't need one
  const missing = symbols.filter((s) => !result[s]);
  const fallback = await Promise.all(missing.map(getChartQuote));
  missing.forEach((s, i) => {
    const q = fallback[i];
    if (q) result[s] = q;
  });

  setCache("yahoo", result, 15);
  return result;
}
