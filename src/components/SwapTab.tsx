"use client";

import { SUPPORTED_TOKENS } from "@/constants/constant";
import SwapInputRow from "./SwapInputRow";
import { useEffect, useState } from "react";
import { LuArrowUpDown, LuLoader2 } from "react-icons/lu";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

export interface TokenDetail {
  name: string;
  image: string;
  mint: string;
  native: boolean;
  decimals: number;
}

export default function Swap({ tokenBalances }: { tokenBalances: any }) {
  const [baseAsset, setBaseAsset] = useState<TokenDetail>(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState<TokenDetail>(
    SUPPORTED_TOKENS[1]
  );
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  useEffect(() => {
    if (!baseAmount) {
      return;
    }
    setIsLoading(false);
    axios
      .get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          baseAsset.mint
        }&outputMint=${quoteAsset.mint}&amount=${
          baseAmount * 10 ** baseAsset.decimals
        }&slippageBps=50`
      )
      .then((res) => {
        console.log(res.data),
          setQuoteAmount(
            Number(res.data.outAmount) / 10 ** quoteAsset.decimals
          );
        setQuoteResponse(res.data);
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => setIsLoading(false));
  }, [baseAmount, baseAsset, quoteAsset]);

  const handleSwap = async () => {
    setIsSwapping(true);
    try {
      const res = await axios.post("/api/swap", {
        quoteResponse,
      });
      console.log(res.data);
      toast.success("Swap Successfully Done!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  const swapSides = (e: any) => {
    e.stopPropagation();
    let currentBaseAsset = baseAsset;
    setBaseAsset(quoteAsset);
    setQuoteAsset(currentBaseAsset);
  };

  return (
    <div className="h-[400px]">
      <div className="flex flex-col items-center relative">
        <SwapInputRow
          tokenBalances={tokenBalances}
          defaultToken={baseAsset}
          onChange={(e: any) => setBaseAmount(e.target.value)}
          text="You Pay"
        />
        <LuArrowUpDown
          onClick={swapSides}
          className="bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer p-2 my-1"
          size={40}
        />
        <SwapInputRow
          tokenBalances={tokenBalances}
          defaultToken={quoteAsset}
          text="You Receive"
          inputDisable={true}
          quoteAmount={quoteAmount}
          isQuoteAsset={true}
          inputLoading={isLoading}
        />
      </div>
      <div className="flex justify-end mr-5 mt-3">
        <Button disabled={isSwapping} onClick={handleSwap}>
          {isSwapping ? (
            <div className="flex items-center gap-1.5">
              <LuLoader2 size={15} className="animate-spin" />
              swapping...
            </div>
          ) : (
            "Swap"
          )}
        </Button>
      </div>
    </div>
  );
}
