"use client";

import { useEffect, useState } from "react";
import { PortfolioResponse } from "@/types/portfolio";

const REFRESH_TIME = 15000;

export function usePortfolio() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Request failed");
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

  return { data, loading, error };
}
