import * as cheerio from "cheerio";
import { getCache, setCache } from "./cache";

export type GoogleData = {
  peRatio: number | null;
  earnings: number | null;
};

function toNumber(text: string) {
  const num = parseFloat(text.replace(/[₹,$\s]/g, ""));
  return isNaN(num) ? null : num;
}

export async function getGoogleData(symbol: string): Promise<GoogleData> {
  const cacheKey = "google:" + symbol;
  const cached = getCache<GoogleData>(cacheKey);
  if (cached) return cached;

  let data: GoogleData = { peRatio: null, earnings: null };

  try {
    const res = await fetch("https://www.google.com/finance/quote/" + symbol, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const valueFor = (label: string) => {
      const labelDiv = $("div")
        .filter((_, el) => $(el).children().length === 0 && $(el).text().trim() === label)
        .first();
      return toNumber(labelDiv.next().text());
    };

    data = {
      peRatio: valueFor("P/E ratio"),
      earnings: valueFor("EPS"),
    };
  } catch (err) {
    console.log("google error for", symbol, err);
  }

  setCache(cacheKey, data, 60 * 60);
  return data;
}
