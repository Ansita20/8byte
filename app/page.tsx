"use client";

import { useMemo } from "react";
import LiveHeader from "@/components/LiveHeader";
import SummaryTiles from "@/components/SummaryTiles";
import PortfolioTable from "@/components/PortfolioTable";
import SectorCards from "@/components/SectorSummary";
import SectorChart from "@/components/SectorChart";
import { usePortfolio } from "@/hooks/usePortfolio";
import { sectorSummaries } from "@/lib/calculations";

function LoadingSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse space-y-5 p-4 sm:p-6">
      <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-96 rounded-xl bg-slate-200 dark:bg-slate-800" />
    </main>
  );
}

export default function Home() {
  const { data, changes, loading, error } = usePortfolio();
  const summaries = useMemo(() => (data ? sectorSummaries(data.rows) : []), [data]);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <p className="mt-24 text-center font-semibold text-red-600">{error}</p>;

  return (
    <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <LiveHeader updatedAt={data.updatedAt} marketOpen={data.marketOpen} />

      {error && <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
      {data.missing.length > 0 && (
        <p className="rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
          Live price not available for: {data.missing.join(", ")}
        </p>
      )}

      <SummaryTiles rows={data.rows} />
      <SectorCards summaries={summaries} />
      <PortfolioTable rows={data.rows} changes={changes} updatedAt={data.updatedAt} />
      <SectorChart summaries={summaries} />

      <p className="text-center text-xs text-slate-400">
        Data comes from unofficial Yahoo Finance and Google Finance sources and may be delayed or inaccurate.
      </p>
    </main>
  );
}
