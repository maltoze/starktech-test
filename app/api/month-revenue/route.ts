import { NextRequest, NextResponse } from "next/server";
import { format, subYears } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.FINMIND_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "FINMIND_API_TOKEN environment variable is not set" },
        { status: 500 }
      );
    }
    const { searchParams } = request.nextUrl;
    const stockId = searchParams.get("stock_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const now = new Date();
    const defaultEndDate = format(now, "yyyy-MM-dd");
    const sixYearsAgo = subYears(now, 6);
    const defaultStartDate = format(sixYearsAgo, "yyyy-MM-dd");

    const apiUrl = new URL("https://api.finmindtrade.com/api/v4/data");
    apiUrl.searchParams.append("dataset", "TaiwanStockMonthRevenue");

    if (stockId) {
      apiUrl.searchParams.append("data_id", stockId);
    }

    apiUrl.searchParams.append("start_date", startDate || defaultStartDate);
    apiUrl.searchParams.append("end_date", endDate || defaultEndDate);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `FinMind API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stock options:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stock options",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
