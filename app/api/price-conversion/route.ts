import { currenciesByNetwork } from "@hypercerts-org/marketplace-sdk";
import { type NextRequest, NextResponse } from "next/server";

const getCurrencyId = (currency_address: string): string | null => {
  const currencyAddressTuples: [string | undefined, string][] = [
    [currenciesByNetwork[42220].CELO?.address, "5567"],
    [currenciesByNetwork[42220].DAI?.address, "4943"],
    [currenciesByNetwork[42220].ETH?.address, "1027"],
    [currenciesByNetwork[42220].USDC?.address, "3408"],
    [currenciesByNetwork[42220].USDGLO?.address, "23888"],
    [currenciesByNetwork[42220].USDT?.address, "825"],
    [currenciesByNetwork[42220].WETH?.address, "2396"],
    [currenciesByNetwork[42220].cUSD?.address, "7236"],
  ];

  const tuple = currencyAddressTuples.find(
    ([address]) => address === currency_address
  );
  return tuple ? tuple[1] : null;
};

type ApiResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: unknown | "SUCCESS";
    elapsed: string;
    credit_count: number;
  };
  data?: {
    symbol: string;
    id: string;
    name: string;
    amount: number;
    last_updated: number;
    quote: {
      cryptoId: number;
      symbol: string;
      price: number;
      lastUpdated: number;
    }[];
  };
};

export type PriceConversionResponse = {
  symbol: string;
  usdPrice: number;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency_address = searchParams.get("currency_address");
  const amount = searchParams.get("amount") ?? "1";
  const convert_id = searchParams.get("convert_id") ?? "2781";

  if (!currency_address) {
    return NextResponse.json(
      { error: "Missing currency_address parameter" },
      { status: 400 }
    );
  }

  const id = getCurrencyId(currency_address);

  if (!id) {
    return NextResponse.json(
      { error: "Unknown currency address" },
      { status: 400 }
    );
  }

  const apiUrl = `https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=${encodeURIComponent(
    amount
  )}&convert_id=${encodeURIComponent(convert_id)}&id=${encodeURIComponent(id)}`;

  try {
    const response = await fetch(apiUrl);
    const _data = (await response.json()) as ApiResponse;
    const data = _data.data;
    if (!data || data.quote.length === 0) {
      throw new Error("No data received.");
    }
    const usdPrice = data.quote[0].price;
    return NextResponse.json({
      symbol: data.symbol,
      usdPrice,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch price data", details: String(error) },
      { status: 500 }
    );
  }
}
