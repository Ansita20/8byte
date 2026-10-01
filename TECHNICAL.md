# Technical Notes

## 1. No official APIs

Neither Yahoo Finance nor Google Finance has a public API.

- **Yahoo (CMP):** I used the unofficial `yahoo-finance2` package. It lets me ask for all 26
  symbols in one `quote()` call instead of 26 separate requests.
- **Google (P/E, EPS):** there is no package for this, so the server downloads the quote page
  (`google.com/finance/quote/HDFCBANK:NSE`) and parses it with `cheerio`.

## 2. Google's HTML keeps changing

Google uses generated class names (like `dO6ijd`) that change from time to time, so selecting by
class broke quickly. Instead I look for the div whose text is exactly `P/E ratio` or `EPS` and read
the value from the div right next to it. Labels change much less often than class names.

If Google still fails for a stock, the API falls back to Yahoo's `trailingPE` and
`epsTrailingTwelveMonths`, so the table rarely shows empty values.

## 3. Rate limiting and caching

The page refreshes every 15 seconds. Without caching that would mean 26 Google requests every
15 seconds per open tab, which would get blocked.

`lib/cache.ts` is a small in-memory cache with an expiry time:

| Data | Cache time | Reason |
|---|---|---|
| CMP (Yahoo) | 15 seconds | changes all the time |
| P/E, EPS (Google) | 1 hour | only change after results |

So Google gets hit once an hour per stock, no matter how many people have the page open.

## 4. Running requests in parallel

The Yahoo call and all the Google calls start together with `Promise.all`, so the first load
takes about as long as the slowest request instead of all of them added up. After the first
load everything comes from the cache and the API answers in a few milliseconds.

## 5. Ticker problems

- The Excel sheet mixes NSE symbols and BSE codes. In `portfolio.json` I kept the code from the
  sheet for display and added a separate `yahooSymbol` and `googleSymbol` for each stock.
- LTI Mindtree was renamed to **LTM** on NSE, so the old `LTIM` symbol returned nothing.
- Savani Financials is not on Yahoo at all, so its CMP is `null`.

## 6. Error handling

- If a stock has no price, its row shows `-` and the sector total uses the purchase value
  for it, so totals don't break.
- The API returns a `missing` list and the page shows a yellow notice naming those stocks.
- If the whole API call fails, the old data stays on screen with a red message, and it
  retries on the next 15 second tick.
- A disclaimer at the bottom says the data comes from unofficial sources.

## 7. Performance

- `PortfolioTable`, `SectorCards` and `SectorChart` are wrapped in `React.memo`.
- Table columns and sector summaries are built with `useMemo`.
- The pie chart animation is turned off so it doesn't redraw itself every 15 seconds.

## 8. Security

There are no API keys. All fetching and scraping happens in the Next.js API route on the
server, so the browser only talks to `/api/portfolio`.
