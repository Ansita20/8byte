import { NextResponse } from "next/server";
import holdings from "@/data/portfolio.json";
import { Holding, PortfolioRow } from "@/types/portfolio";
import { getYahooQuotes } from "@/lib/yahoo";
import { getGoogleData } from "@/lib/google";

export const dynamic = "force-dynamic";

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
        cmp: y?.cmp ?? null,
        peRatio: g.peRatio ?? y?.peRatio ?? null,
        earnings: g.earnings ?? y?.earnings ?? null,
      };
    });

    const missing = rows.filter((r) => r.cmp === null).map((r) => r.name);

    return NextResponse.json({ rows, missing, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.log("portfolio api error:", err);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
