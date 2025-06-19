export interface BitcoinPrice {
  id: number;
  price: number;
  timestamp: string;
  source: string;
}

export interface Stats {
  min: number;
  max: number;
  avg: number;
  first: number;
  last: number;
  change: number;
  changePercent: number;
}

export interface PricesResponse {
  data: BitcoinPrice[];
  count: number;
}
