"use client";

import { memo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SectorSummary } from "@/types/portfolio";
import { formatMoney } from "@/lib/format";

const COLORS = ["#2a6f97", "#e07a5f", "#81b29a", "#f2cc8f", "#6d597a", "#3d405b"];

function SectorChart({ summaries }: { summaries: SectorSummary[] }) {
  const data = summaries.map((s) => ({ name: s.sector, value: Math.round(s.presentValue) }));

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Sector Allocation (Present Value)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} isAnimationActive={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => "₹" + formatMoney(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SectorChart);
