import { PortfolioRow, SectorSummary } from "@/types/portfolio";

export function investment(row: PortfolioRow) {
  return row.purchasePrice * row.qty;
}

export function presentValue(row: PortfolioRow) {
  if (row.cmp === null) return null;
  return row.cmp * row.qty;
}

export function gainLoss(row: PortfolioRow) {
  const pv = presentValue(row);
  if (pv === null) return null;
  return pv - investment(row);
}

export function gainLossPercent(row: PortfolioRow) {
  const gl = gainLoss(row);
  if (gl === null) return null;
  return (gl / investment(row)) * 100;
}

export function totalInvestment(rows: PortfolioRow[]) {
  return rows.reduce((sum, row) => sum + investment(row), 0);
}

export function portfolioPercent(row: PortfolioRow, total: number) {
  return (investment(row) / total) * 100;
}

export function groupBySector(rows: PortfolioRow[]) {
  const groups: Record<string, PortfolioRow[]> = {};
  for (const row of rows) {
    if (!groups[row.sector]) groups[row.sector] = [];
    groups[row.sector].push(row);
  }
  return groups;
}

export function summarize(sector: string, rows: PortfolioRow[], grandTotal: number): SectorSummary {
  const inv = totalInvestment(rows);
  const pv = rows.reduce((sum, row) => sum + (presentValue(row) ?? investment(row)), 0);
  const gl = pv - inv;

  return {
    sector,
    investment: inv,
    presentValue: pv,
    gainLoss: gl,
    gainLossPercent: (gl / inv) * 100,
    portfolioPercent: (inv / grandTotal) * 100,
  };
}

export function sectorSummaries(rows: PortfolioRow[]) {
  const total = totalInvestment(rows);
  const groups = groupBySector(rows);
  return Object.keys(groups).map((sector) => summarize(sector, groups[sector], total));
}
