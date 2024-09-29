import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  connection,
  fetchTokenPrices,
  SUPPORTED_TOKENS,
} from "@/constants/constant";

export async function GET(req: NextRequest) {
  try {
    const publicKey = req.nextUrl.searchParams.get("address");

    if (!publicKey) {
      return NextResponse.json(
        {
          message: "Public Key is missing!",
        },
        { status: 411 }
      );
    }

    const prices = await fetchTokenPrices();

    const tokenInfo = await Promise.all(
      SUPPORTED_TOKENS.map(async (token) => {
        try {
          if (token.native) {
            const balance = await connection.getBalance(new PublicKey(publicKey));
            return {
              ...token,
              balance: Number(balance) / LAMPORTS_PER_SOL,
              price: prices[token.name].price,
            };
          }

          const ata = await getAssociatedTokenAddress(
            new PublicKey(token.mint),
            new PublicKey(publicKey)
          );

          if (ata) {
            const balanceInfo = await connection.getTokenAccountBalance(ata);
            return {
              ...token,
              balance: Number(balanceInfo.value.uiAmount),
              price: prices[token.name].price,
            };
          } else {
            return { ...token, balance: 0, price: prices[token.name].price };
          }
        } catch (error: any) {
          console.log(error.message);
          return { ...token, balance: 0, price: prices[token.name].price };
        }
      })
    );

    const totalBalance = tokenInfo.reduce(
      (acc, val) => acc + val.balance * val.price,
      0
    );

    return NextResponse.json({
      tokenInfo,
      totalBalance,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
