import ThemeToggle from "./ThemeToggle";

type Props = {
  updatedAt: string;
  marketOpen: boolean;
};

export default function LiveHeader({ updatedAt, marketOpen }: Props) {
  return (
    <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-lg dark:from-emerald-900 dark:to-teal-900">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">Portfolio Dashboard</h1>
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                {marketOpen && <span className="absolute h-full w-full animate-ping rounded-full bg-green-300" />}
                <span className={"relative h-2.5 w-2.5 rounded-full " + (marketOpen ? "bg-green-400" : "bg-slate-300")} />
              </span>
              {marketOpen ? "LIVE · Market open" : "Market closed"}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/80">
            Updated {new Date(updatedAt).toLocaleTimeString()} · refreshes every 15 seconds
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div className="h-1 bg-white/10">
        <div key={updatedAt} className="h-full animate-countdown bg-white/70" />
      </div>
    </header>
  );
}
