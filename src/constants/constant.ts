import { Connection } from "@solana/web3.js";
import axios from "axios";
import { NextResponse } from "next/server";

export const SUPPORTED_TOKENS: {
  name: string;
  mint: string;
  native: boolean;
}[] = [
    {
      name: "USDC",
      mint: "FSxJ85FXVsXSr51SeWf9ciJWTcRnqKFSmBgRDeL3KyWw",
      native: false,
    },
    {
      name: "USDT",
      mint: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
      native: false,
    },
  {
    name: "SOL",
    mint: "",
    native: true,
  },
];

let priceCache: { prices: any; lastFetched: number } | null = null;
const CACHE_TTL = 600000;

export const fetchTokenPrices = async () => {
  const currentTime = Date.now();
  if (priceCache && currentTime - priceCache.lastFetched < CACHE_TTL) {
    return priceCache.prices;
  }
  try {
    const response = await axios.get(
      `${process.env.CRYPTO_PRICE_URL}?ids=${SUPPORTED_TOKENS.map(
        (token) => token.name
      ).join(",")}`
    );

    const prices = response.data.data;

    priceCache = {
      prices,
      lastFetched: currentTime,
    };

    return  prices;
  
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error,
      },
      { status: 500 }
    );
  }
};

export const connection = new Connection("https://api.devnet.solana.com");
