import { memo } from "react";
import { SectorSummary } from "@/types/portfolio";
import { colorClass, formatMoney, formatPercent } from "@/lib/format";

export function SectorSubtotalRow({ summary, isTotal }: { summary: SectorSummary; isTotal?: boolean }) {
  const rowClass = isTotal ? "bg-emerald-900 text-white" : "bg-emerald-100";
  const glClass = isTotal ? "" : colorClass(summary.gainLoss);

  return (
    <tr className={rowClass + " font-bold"}>
      <td className="px-3 py-2"></td>
      <td className="px-3 py-2">{isTotal ? "Grand Total" : summary.sector}</td>
      <td></td>
      <td></td>
      <td className="px-3 py-2">{formatMoney(summary.investment)}</td>
      <td className="px-3 py-2">{formatPercent(summary.portfolioPercent)}</td>
      <td></td>
      <td></td>
      <td className="px-3 py-2">{formatMoney(summary.presentValue)}</td>
      <td className={"px-3 py-2 " + glClass}>{formatMoney(summary.gainLoss)}</td>
      <td className={"px-3 py-2 " + glClass}>{formatPercent(summary.gainLossPercent)}</td>
      <td></td>
      <td></td>
    </tr>
  );
}

function SectorCards({ summaries }: { summaries: SectorSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaries.map((s) => (
        <div className="rounded-lg bg-white p-4 shadow-sm" key={s.sector}>
          <h3 className="mb-2 font-semibold">{s.sector}</h3>
          <p className="text-sm text-slate-500">Invested: ₹{formatMoney(s.investment)}</p>
          <p className="text-sm text-slate-500">Current: ₹{formatMoney(s.presentValue)}</p>
          <p className={"mt-1 text-sm " + colorClass(s.gainLoss)}>
            {formatMoney(s.gainLoss)} ({formatPercent(s.gainLossPercent)})
          </p>
        </div>
      ))}
    </div>
  );
}

export default memo(SectorCards);
