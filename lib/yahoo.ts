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

  setCache("yahoo", result, 15);
  return result;
}
