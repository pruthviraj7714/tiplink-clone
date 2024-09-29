import { connection } from "@/constants/constant";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized User!",
      },
      { status: 403 }
    );
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email as string,
      },
      include: {
        solWallet: {
          select: {
            publicKey: true,
            privateKey: true,
          },
        },
      },
    });

    if (!user || !user.solWallet) {
      return NextResponse.json(
        {
          message: "Wallet not found!",
        },
        { status: 403 }
      );
    }

    const { quoteResponse } = await req.json();

    if (!quoteResponse) {
      return NextResponse.json(
        {
          message: "Quote Response Not found!",
        },
        { status: 411 }
      );
    }

    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: user?.solWallet?.publicKey.toString(),
          wrapAndUnwrapSol: true,
        }),
      })
    ).json();

    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const arr = user.solWallet.privateKey.split(",").map((x) => Number(x));
    const secretKey = Uint8Array.from(arr);

    transaction.sign([
      { secretKey, publicKey: new PublicKey(user.solWallet.publicKey) },
    ]);

    const latestBlockHash = await connection.getLatestBlockhash();

    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txid,
    });
    console.log(`https://solscan.io/tx/${txid}`);

    return NextResponse.json(
      {
        message: "Successful Transaction!",
        txid,
      },
      { status: 200 }
    );
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
