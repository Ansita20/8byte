"use client";

import { Fragment, memo, useMemo } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PortfolioRow } from "@/types/portfolio";
import {
  gainLoss,
  gainLossPercent,
  groupBySector,
  investment,
  portfolioPercent,
  presentValue,
  sectorSummaries,
  summarize,
  totalInvestment,
} from "@/lib/calculations";
import { arrow, colorClass, formatMoney, formatPercent } from "@/lib/format";
import { PriceChanges } from "@/hooks/usePortfolio";
import { SectorSubtotalRow } from "./SectorSummary";

const column = createColumnHelper<PortfolioRow>();

type Props = {
  rows: PortfolioRow[];
  changes: PriceChanges;
  updatedAt: string;
};

function PortfolioTable({ rows, changes, updatedAt }: Props) {
  const total = totalInvestment(rows);

  const columns = useMemo(
    () => [
      column.display({ id: "no", header: "No" }),
      column.accessor("name", { header: "Particulars" }),
      column.accessor("purchasePrice", { header: "Purchase Price", cell: (info) => formatMoney(info.getValue()) }),
      column.accessor("qty", { header: "Qty" }),
      column.display({ id: "investment", header: "Investment", cell: (info) => formatMoney(investment(info.row.original)) }),
      column.display({
        id: "portfolio",
        header: "Portfolio (%)",
        cell: (info) => formatPercent(portfolioPercent(info.row.original, total)),
      }),
      column.accessor("exchangeCode", { header: "NSE/BSE" }),
      column.accessor("cmp", { header: "CMP", cell: (info) => formatMoney(info.getValue()) }),
      column.display({
        id: "presentValue",
        header: "Present Value",
        cell: (info) => formatMoney(presentValue(info.row.original)),
      }),
      column.display({
        id: "gainLoss",
        header: "Gain/Loss",
        cell: (info) => {
          const value = gainLoss(info.row.original);
          return <span className={colorClass(value)}>{formatMoney(value)}</span>;
        },
      }),
      column.display({
        id: "gainLossPercent",
        header: "Gain/Loss (%)",
        cell: (info) => {
          const value = gainLossPercent(info.row.original);
          return (
            <span className={colorClass(value)}>
              {arrow(value)}
              {formatPercent(value)}
            </span>
          );
        },
      }),
      column.accessor("peRatio", { header: "P/E (TTM)", cell: (info) => formatMoney(info.getValue()) }),
      column.accessor("earnings", { header: "Latest Earnings", cell: (info) => formatMoney(info.getValue()) }),
    ],
    [total]
  );

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  const sectors = Object.keys(groupBySector(rows));
  const summaries = sectorSummaries(rows);
  const grandTotal = summarize("Total", rows, total);

  return (
    <div className="max-h-[70vh] overflow-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="sticky top-0 z-10 bg-slate-800 text-white dark:bg-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-3 py-3 font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {sectors.map((sector) => {
            const sectorRows = table.getRowModel().rows.filter((r) => r.original.sector === sector);
            const summary = summaries.find((s) => s.sector === sector)!;

            return (
              <Fragment key={sector}>
                <SectorSubtotalRow summary={summary} />
                {sectorRows.map((row, i) => (
                  <tr key={row.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "no") {
                        return (
                          <td key={cell.id} className="px-3 py-2 text-slate-400">
                            {i + 1}
                          </td>
                        );
                      }

                      const change = changes[row.original.name];
                      const flash = change === "up" ? "animate-flash-up" : change === "down" ? "animate-flash-down" : "";

                      if (cell.column.id === "cmp" && flash) {
                        return (
                          <td key={cell.id + updatedAt} className={"px-3 py-2 font-semibold " + flash}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      }

                      return (
                        <td key={cell.id} className="px-3 py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            );
          })}
          <SectorSubtotalRow summary={grandTotal} isTotal />
        </tbody>
      </table>
    </div>
  );
}

export default memo(PortfolioTable);
