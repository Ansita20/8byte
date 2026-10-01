"use client";

import { useMemo } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import SectorCards from "@/components/SectorSummary";
import SectorChart from "@/components/SectorChart";
import { usePortfolio } from "@/hooks/usePortfolio";
import { sectorSummaries } from "@/lib/calculations";

export default function Home() {
  const { data, loading, error } = usePortfolio();
  const summaries = useMemo(() => (data ? sectorSummaries(data.rows) : []), [data]);

  if (loading) return <p className="mt-24 text-center text-slate-500">Loading portfolio...</p>;
  if (!data) return <p className="mt-24 text-center font-semibold text-red-600">{error}</p>;

  return (
    <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">Portfolio Dashboard</h1>
          {data.marketOpen ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Market open</span>
          ) : (
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              Market closed · showing last traded prices
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">
          Last updated: {new Date(data.updatedAt).toLocaleTimeString()} (refreshes every 15 seconds)
        </p>
      </div>

      {error && <p className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>}
      {data.missing.length > 0 && (
        <p className="rounded bg-yellow-100 p-3 text-sm text-yellow-800">
          Live price not available for: {data.missing.join(", ")}
        </p>
      )}

      <SectorCards summaries={summaries} />
      <PortfolioTable rows={data.rows} />
      <SectorChart summaries={summaries} />

      <p className="text-xs text-slate-400">
        Data comes from unofficial Yahoo Finance and Google Finance sources and may be delayed or inaccurate.
      </p>
    </main>
  );
}
