import { IFinMindResponse, IStockOption } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";


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
    const limit = parseInt(searchParams.get("limit") || "20");

    const apiUrl = new URL("https://api.finmindtrade.com/api/v4/data");
    apiUrl.searchParams.append("dataset", "TaiwanStockInfo");

    if (stockId) {
      apiUrl.searchParams.append("data_id", stockId);
    }

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

    const data: IFinMindResponse<IStockOption[]> = await response.json();

    if (data.status !== 200) {
      return NextResponse.json(
        {
          error: `FinMind API returned status: ${data.status}, message: ${data.msg}`,
        },
        { status: 400 }
      );
    }

    // 限制返回数据量，只取前N条
    const limitedData = data.data.slice(0, limit);

    return NextResponse.json({
      msg: data.msg,
      status: data.status,
      data: limitedData,
      total: limitedData.length,
      originalTotal: data.data.length,
    });
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
