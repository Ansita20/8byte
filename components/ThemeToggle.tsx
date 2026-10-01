"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm transition hover:scale-105 dark:border-slate-700 dark:bg-slate-800"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
