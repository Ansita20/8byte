"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioResponse } from "@/types/portfolio";

const REFRESH_TIME = 15000;

export type PriceChanges = Record<string, "up" | "down">;

export function usePortfolio() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [changes, setChanges] = useState<PriceChanges>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lastPrices = useRef<Record<string, number | null>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portfolio");
        const json: PortfolioResponse & { error?: string } = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Request failed");

        const newChanges: PriceChanges = {};
        for (const row of json.rows) {
          const old = lastPrices.current[row.name];
          if (old != null && row.cmp != null && row.cmp !== old) {
            newChanges[row.name] = row.cmp > old ? "up" : "down";
          }
          lastPrices.current[row.name] = row.cmp;
        }

        setChanges(newChanges);
        setData(json);
        setError("");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message + ". Retrying in 15 seconds...");
      } finally {
        setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, REFRESH_TIME);
    return () => clearInterval(timer);
  }, []);

  return { data, changes, loading, error };
}
