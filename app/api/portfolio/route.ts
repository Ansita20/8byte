import { NextResponse } from "next/server";
import holdings from "@/data/portfolio.json";
import { Holding, PortfolioRow } from "@/types/portfolio";
import { getYahooQuotes } from "@/lib/yahoo";
import { getGoogleData } from "@/lib/google";

export const dynamic = "force-dynamic";

// NSE is open 9:15 AM to 3:30 PM IST, Monday to Friday (holidays not covered)
function isNseOpenNow() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const day = ist.getUTCDay();
  const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return day >= 1 && day <= 5 && minutes >= 9 * 60 + 15 && minutes < 15 * 60 + 30;
}

export async function GET() {
  try {
    const list = holdings as Holding[];

    const [yahoo, google] = await Promise.all([
      getYahooQuotes(list.map((h) => h.yahooSymbol)),
      Promise.all(list.map((h) => getGoogleData(h.googleSymbol))),
    ]);

    const rows: PortfolioRow[] = list.map((h, i) => {
      const y = yahoo[h.yahooSymbol];
      const g = google[i];

      return {
        ...h,
        cmp: y?.cmp ?? g.price ?? null,
        peRatio: g.peRatio ?? y?.peRatio ?? null,
        earnings: g.earnings ?? y?.earnings ?? null,
      };
    });

    const missing = rows.filter((r) => r.cmp === null).map((r) => r.name);
    const fifteenMinutes = 15 * 60 * 1000;
    const quotes = Object.values(yahoo);
    // If Yahoo failed (it often blocks cloud servers), fall back to NSE trading hours
    const marketOpen =
      quotes.length > 0
        ? quotes.some(
            (q) => q.marketState === "REGULAR" && q.lastTradeTime !== null && Date.now() - q.lastTradeTime < fifteenMinutes
          )
        : isNseOpenNow();

    return NextResponse.json({ rows, missing, marketOpen, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.log("portfolio api error:", err);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
