import { memo } from "react";
import { PortfolioRow } from "@/types/portfolio";
import { gainLossPercent, investment, presentValue } from "@/lib/calculations";
import { arrow, colorClass, formatMoney, formatPercent } from "@/lib/format";

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-1 text-lg font-bold sm:text-xl">{children}</div>
    </div>
  );
}

function SummaryTiles({ rows }: { rows: PortfolioRow[] }) {
  const invested = rows.reduce((sum, r) => sum + investment(r), 0);
  const current = rows.reduce((sum, r) => sum + (presentValue(r) ?? investment(r)), 0);
  const gain = current - invested;
  const gainPct = (gain / invested) * 100;

  const withPrice = rows.filter((r) => r.cmp !== null);
  const sorted = [...withPrice].sort((a, b) => gainLossPercent(b)! - gainLossPercent(a)!);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Tile label="Invested">₹{formatMoney(invested)}</Tile>
      <Tile label="Current Value">₹{formatMoney(Math.round(current))}</Tile>
      <Tile label="Total Gain/Loss">
        <span className={colorClass(gain)}>
          {arrow(gain)}₹{formatMoney(Math.abs(Math.round(gain)))}
          <span className="block text-sm">{formatPercent(gainPct)}</span>
        </span>
      </Tile>
      {best && (
        <Tile label="Top Performer">
          {best.name}
          <span className={"block text-sm " + colorClass(gainLossPercent(best))}>
            {arrow(gainLossPercent(best))}
            {formatPercent(gainLossPercent(best))}
          </span>
        </Tile>
      )}
      {worst && (
        <Tile label="Worst Performer">
          {worst.name}
          <span className={"block text-sm " + colorClass(gainLossPercent(worst))}>
            {arrow(gainLossPercent(worst))}
            {formatPercent(gainLossPercent(worst))}
          </span>
        </Tile>
      )}
    </div>
  );
}

export default memo(SummaryTiles);
