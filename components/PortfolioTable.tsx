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
import { colorClass, formatMoney, formatPercent } from "@/lib/format";
import { SectorSubtotalRow } from "./SectorSummary";

const column = createColumnHelper<PortfolioRow>();

function PortfolioTable({ rows }: { rows: PortfolioRow[] }) {
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
          return <span className={colorClass(value)}>{formatPercent(value)}</span>;
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
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-emerald-900 text-white">
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
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2">
                        {cell.column.id === "no" ? i + 1 : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
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
