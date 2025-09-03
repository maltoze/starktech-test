"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { type EChartsOption } from "echarts";
import { IRespMonthRevenue } from "../types";

interface RevenueChartProps {
  revenueData: IRespMonthRevenue[];
  loading?: boolean;
}

export default function RevenueChart({
  revenueData,
  loading = false,
}: RevenueChartProps) {
  const chartOption: EChartsOption = useMemo(() => {
    if (!revenueData || !Array.isArray(revenueData)) {
      return {};
    }

    const sortedData = revenueData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const dataWithGrowthRate = sortedData.slice(12).map((item, index) => {
      const originalIndex = index + 12;
      const currentRevenue = item.revenue;
      const previousYearRevenue = sortedData[originalIndex - 12]?.revenue;

      const date = new Date(item.date);
      const dateString = `${date.getFullYear()}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      let growthRate = null;
      if (previousYearRevenue && previousYearRevenue !== 0) {
        growthRate = (currentRevenue / previousYearRevenue - 1) * 100;
      }

      return {
        date: dateString,
        revenue: currentRevenue,
        growthRate: growthRate,
      };
    });

    const dates = dataWithGrowthRate.map((item) => item.date);
    const revenues = dataWithGrowthRate.map((item) => item.revenue);
    const growthRates = dataWithGrowthRate.map((item) => item.growthRate);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: function (params: any) {
          let result = params[0].name + "<br/>";
          params.forEach((param: any) => {
            if (param.seriesName === "每月營收") {
              result +=
                param.marker +
                " " +
                param.seriesName +
                ": " +
                (param.value / 1000).toLocaleString() +
                " 千元<br/>";
            } else if (param.seriesName === "單月營收年增率 (%)") {
              result +=
                param.marker +
                " " +
                param.seriesName +
                ": " +
                (param?.value ?? 0).toFixed(2) +
                "%<br/>";
            }
          });
          return result;
        },
      },
      legend: {
        data: ["每月營收", "單月營收年增率 (%)"],
        top: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: dates,
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: function (value) {
            return value.split("/")[0];
          },
          interval: 12,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "千元",
          position: "left",
          axisLabel: {
            formatter: function (value: number) {
              return (value / 1000).toLocaleString();
            },
          },
        },
        {
          type: "value",
          name: "%",
          position: "right",
          axisLabel: {
            formatter: "{value}%",
          },
        },
      ],
      series: [
        {
          name: "每月營收",
          type: "bar",
          yAxisIndex: 0,
          data: revenues,
          itemStyle: {
            color: "#DAA520", // 金黄色
          },
          barWidth: "60%",
        },
        {
          name: "單月營收年增率 (%)",
          type: "line",
          yAxisIndex: 1,
          data: growthRates,
          itemStyle: {
            color: "#DC143C", // 深红色
          },
          lineStyle: {
            color: "#DC143C",
            width: 2,
          },
          symbol: "circle",
          symbolSize: 4,
          connectNulls: false,
        },
      ],
    };
  }, [revenueData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">载入中...</div>
      </div>
    );
  }

  if (!revenueData?.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  return (
    <ReactECharts
      option={chartOption}
      style={{ height: "500px", width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
}
