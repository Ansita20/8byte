import { memo } from "react";
import { SectorSummary } from "@/types/portfolio";
import { arrow, colorClass, formatMoney, formatPercent } from "@/lib/format";

export function sectorColor(index: number) {
  return `var(--series-${index + 1})`;
}

export function SectorSubtotalRow({ summary, isTotal }: { summary: SectorSummary; isTotal?: boolean }) {
  const rowClass = isTotal
    ? "bg-emerald-800 text-white dark:bg-emerald-900"
    : "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
  const glClass = isTotal ? "" : colorClass(summary.gainLoss);

  return (
    <tr className={rowClass + " font-bold"}>
      <td className="px-3 py-2.5"></td>
      <td className="px-3 py-2.5">{isTotal ? "Grand Total" : summary.sector}</td>
      <td></td>
      <td></td>
      <td className="px-3 py-2.5">{formatMoney(summary.investment)}</td>
      <td className="px-3 py-2.5">{formatPercent(summary.portfolioPercent)}</td>
      <td></td>
      <td></td>
      <td className="px-3 py-2.5">{formatMoney(Math.round(summary.presentValue))}</td>
      <td className={"px-3 py-2.5 " + glClass}>{formatMoney(Math.round(summary.gainLoss))}</td>
      <td className={"px-3 py-2.5 " + glClass}>
        {arrow(summary.gainLossPercent)}
        {formatPercent(summary.gainLossPercent)}
      </td>
      <td></td>
      <td></td>
    </tr>
  );
}

function SectorCards({ summaries }: { summaries: SectorSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaries.map((s, i) => (
        <div
          key={s.sector}
          className="rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: sectorColor(i) }} />
            <h3 className="font-semibold">{s.sector}</h3>
          </div>
          <p className="mt-2 text-lg font-bold">₹{formatMoney(Math.round(s.presentValue))}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Invested ₹{formatMoney(s.investment)}</p>
          <p className={"mt-1 text-sm " + colorClass(s.gainLoss)}>
            {arrow(s.gainLoss)}
            {formatMoney(Math.round(s.gainLoss))} ({formatPercent(s.gainLossPercent)})
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full" style={{ width: s.portfolioPercent + "%", background: sectorColor(i) }} />
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatPercent(s.portfolioPercent)} of portfolio</p>
        </div>
      ))}
    </div>
  );
}

export default memo(SectorCards);
