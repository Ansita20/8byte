"use client";

import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SectorSummary } from "@/types/portfolio";
import { formatMoney, formatPercent } from "@/lib/format";
import { sectorColor } from "./SectorSummary";

function SectorChart({ summaries }: { summaries: SectorSummary[] }) {
  const data = summaries.map((s) => ({ name: s.sector, value: Math.round(s.presentValue) }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Sector Allocation</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Share of current portfolio value</p>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="95%"
                stroke="var(--surface)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((d, i) => (
                  <Cell key={d.name} fill={sectorColor(i)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => "₹" + formatMoney(Number(value))}
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
            <span className="text-lg font-bold">₹{formatMoney(total)}</span>
          </div>
        </div>

        <ul className="space-y-2">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: sectorColor(i) }} />
                {d.name}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ₹{formatMoney(d.value)} · {formatPercent((d.value / total) * 100)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default memo(SectorChart);
