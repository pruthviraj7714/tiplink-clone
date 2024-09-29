"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Assets from "@/components/Assets";
import Send from "@/components/SendTab";
import AddFunds from "@/components/AddFunds";
import Swap from "@/components/SwapTab";
import Withdraw from "@/components/Withdraw";
import { useTokenInfo } from "@/hooks/useTokenInfo";

interface UserInfoType {
  email: string;
  id: string;
  image: string;
  name: string;
  password: string | null;
  provider: "Google";
  solWallet: { publicKey: string };
}

type Tab = "Tokens" | "Withdraw" | "Send" | "Add Funds" | "Swap";

const Tabs = ["Tokens", "Withdraw", "Send", "Add Funds", "Swap"];
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("Tokens");

  const { loading, tokenInfo, totalBalance } = useTokenInfo(
    userInfo?.solWallet?.publicKey || ""
  );

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/info");
      console.log(res.data);
      setUserInfo(res.data.user);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (status === "loading" || loading) {
    return <div>loading...</div>;
  }

  if (status == "unauthenticated" || !session?.user) {
    router.push("/");
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <Card className="mt-24 border border-black/35 w-[820px] shadow-2xl p-6">
        <CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-12 w-12">
              <Image
                src={session?.user?.image as string}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div className="font-bold text-2xl">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </div>
          </div>
        </CardTitle>
        <CardContent>
          <div className="flex flex-col justify-center ">
            <div className="flex justify-end">
              <Button
                disabled={isCopied}
                onClick={() => {
                  setIsCopied(true);
                  if (userInfo?.solWallet.publicKey) {
                    navigator.clipboard.writeText(
                      userInfo?.solWallet?.publicKey as string
                    );
                  } else {
                    toast.error("No address found to copy");
                  }
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 3000);
                }}
              >
                {isCopied ? "Copied" : "Your Wallet Address"}
              </Button>
            </div>
            <div className="flex justify-evenly mt-10 gap-3 items-center border border-black/15">
              {Tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setCurrentTab(tab as Tab)}
                  className={`w-full text-center text-nowrap font-semibold  px-10 py-1 cursor-pointer border-black ${
                    currentTab === tab
                      ? "bg-sky-700 text-white hover:bg-sky-800"
                      : "bg-blue-100 text-sky-700 hover:bg-sky-300"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="w-full pt-10">
              <div
                className={`${currentTab === "Tokens" ? "visible" : "hidden"}`}
              >
                <Assets tokenInfo={tokenInfo} loading={loading} totalBalance={totalBalance} />
              </div>
              <div
                className={`${currentTab === "Send" ? "visible" : "hidden"}`}
              >
                <Send />
              </div>
              <div
                className={`${
                  currentTab === "Add Funds" ? "visible" : "hidden"
                }`}
              >
                <AddFunds />
              </div>
              <div
                className={`${
                  currentTab === "Withdraw" ? "visible" : "hidden"
                }`}
              >
                <Withdraw />
              </div>
              <div
                className={`${currentTab === "Swap" ? "visible" : "hidden"}`}
              >
                <Swap tokenBalances={tokenInfo} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
