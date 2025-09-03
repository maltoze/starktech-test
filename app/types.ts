export interface IStockOption {
  label: string;
  value: string;
}

export interface IRespStockOption {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string;
}

export interface IRespMonthRevenue {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}
export interface IFinMindResponse<T> {
  msg: string;
  status: number;
  data: T
}
