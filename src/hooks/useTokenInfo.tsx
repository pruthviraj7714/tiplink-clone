"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useTokenInfo(address: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  const getTokenInfo = async () => {
    try {
      const res = await axios.get(`/api/user/tokens?address=${address}`);
      setTokenInfo(res.data.tokenInfo);
      setTotalBalance(res.data.totalBalance);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(address) {
      getTokenInfo();
    }
  }, [address]);

  return {
    loading,
    tokenInfo,
    totalBalance,
  };
}
