"use client";

import { useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { IRespMonthRevenue } from "../types";

interface RevenueTableProps {
  revenueData: IRespMonthRevenue[];
  loading?: boolean;
}

export default function RevenueTable({ revenueData, loading = false }: RevenueTableProps) {
  const tableData = useMemo(() => {
    if (!revenueData) {
      return [];
    }

    return revenueData.slice(12).map((item, index) => {
      const date = new Date(item.date);
      const dateString = `${date.getFullYear()}${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const currentRevenue = item.revenue;
      const previousYearData = revenueData.find((d) => {
        const prevDate = new Date(d.date);
        return (
          prevDate.getFullYear() === date.getFullYear() - 1 &&
          prevDate.getMonth() === date.getMonth()
        );
      });

      let growthRate = null;
      if (previousYearData && previousYearData.revenue !== 0) {
        growthRate =
          ((currentRevenue - previousYearData.revenue) /
            previousYearData.revenue) *
          100;
      }

      return {
        yearMonth: dateString,
        revenue: currentRevenue,
        growthRate: growthRate,
      };
    });
  }, [revenueData]);

  return (
    <div className="py-4 px-5 border border-[#dfdfdf] bg-white rounded-[3px]">
      <div className="mb-4">
        <Button variant="contained" color="primary">
          詳細數據
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-gray-500">载入中...</div>
        </div>
      ) : revenueData.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-gray-500">暂无数据</div>
        </div>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", border: "1px solid #dfdfdf" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F6F8FA" }}>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#434343",
                      whiteSpace: "nowrap",
                      border: "1px solid #DCDFE2",
                    }}
                  >
                    年度月份
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell
                      key={item.yearMonth}
                      align="center"
                      sx={{
                        fontWeight: "600",
                        color: "#434343",
                        border: "1px solid #DCDFE2",
                      }}
                    >
                      {item.yearMonth}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#434343",
                      backgroundColor: "#fafafa",
                      whiteSpace: "nowrap",
                      border: "1px solid #DCDFE2",
                    }}
                  >
                    每月營收
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell
                      key={`revenue-${item.yearMonth}`}
                      align="center"
                      sx={{
                        border: "1px solid #DCDFE2",
                      }}
                    >
                      {item.revenue.toLocaleString()}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow sx={{ backgroundColor: "#F6F8FA" }}>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#434343",
                      backgroundColor: "#fafafa",
                      whiteSpace: "nowrap",
                      border: "1px solid #DCDFE2",
                    }}
                  >
                    單月營收年增率 (%)
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell
                      key={`growth-${item.yearMonth}`}
                      align="center"
                      sx={{
                        border: "1px solid #DCDFE2",
                      }}
                    >
                      {item.growthRate !== null
                        ? item.growthRate.toFixed(2)
                        : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-4 text-right text-sm text-gray-500">
            <p>圖表單位：千元，數據來自公開資訊觀測站</p>
            <p>網頁圖表歡迎轉貼引用，請註明出處為財報狗</p>
          </div>
        </>
      )}
    </div>
  );
}
