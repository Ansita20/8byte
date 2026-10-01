export type Holding = {
  name: string;
  sector: string;
  purchasePrice: number;
  qty: number;
  exchangeCode: string;
  yahooSymbol: string;
  googleSymbol: string;
};

export type LiveQuote = {
  cmp: number | null;
  peRatio: number | null;
  earnings: number | null;
};

export type PortfolioRow = Holding & LiveQuote;

export type SectorSummary = {
  sector: string;
  investment: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
};

export type PortfolioResponse = {
  rows: PortfolioRow[];
  missing: string[];
  marketOpen: boolean;
  updatedAt: string;
};
