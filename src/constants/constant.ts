import { Connection } from "@solana/web3.js";
import axios from "axios";
import { NextResponse } from "next/server";

export const SUPPORTED_TOKENS: {
  name: string;
  mint: string;
  native: boolean;
  image: string;
  decimals: number;
}[] = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSEVwqwbF9IuKkegPO3sshUgShx5JmzedlPg&s",
    decimals: 9,
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    image: "https://guarda.com/assets/images/academy/thumbs/usdc-review.webp",
    decimals: 6,
  },
  {
    name: "USDT",
    mint: "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
    native: false,
    image:
      "https://png.pngtree.com/png-clipart/20230923/original/pngtree-tether-symbol-vector-icon-usdt-logo-crypto-pay-financial-altcoin-vector-png-image_12543912.png",
    decimals: 6,
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

    return prices;
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
