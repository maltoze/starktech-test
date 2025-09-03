"use client";

import { useEffect, useState } from "react";
import RevenueChart from "./RevenueChart";
import RevenueTable from "./RevenueTable";
import { IFinMindResponse, IRespMonthRevenue, IStockOption } from "../types";
import { Button } from "@mui/material";
import SearchAutoComplete from "./SearchAutoComplete";

export default function HomePage() {
  const [selectedStock, setSelectedStock] = useState<IStockOption | null>(null);
  const [revenueData, setRevenueData] = useState<IRespMonthRevenue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRevenueData = async () => {
    if (!selectedStock) return;

    setLoading(true);
    try {
      const resp = await fetch(
        `/api/month-revenue?stock_id=${selectedStock.value}`
      );
      const data: IFinMindResponse<IRespMonthRevenue[]> = await resp.json();
      setRevenueData(data.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedStock]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white h-[58px] flex justify-center items-center py-2.5 shadow-sm z-50">
        <SearchAutoComplete onValueChange={setSelectedStock} />
      </div>
      {selectedStock && (
        <div className="pt-[58px] pb-4 min-h-screen mx-auto max-w-[1100px] space-y-1.5">
          <div className="mt-[18px] rounded-[3px] border border-[#DFDFDF] text-lg font-semibold py-4 px-5 w-full text-[#434343] bg-[#fafafa]">
            {selectedStock.label}
          </div>
          <div className="py-4 px-5 border border-[#dfdfdf] bg-white rounded-[3px]">
            <div className="flex justify-between items-center mb-4">
              <Button variant="contained" color="primary">
                每月營收
              </Button>
              <Button variant="contained" color="primary">
                近 5 年
              </Button>
            </div>
            <RevenueChart revenueData={revenueData} loading={loading} />
          </div>
          <RevenueTable revenueData={revenueData} loading={loading} />
        </div>
      )}
    </div>
  );
}
