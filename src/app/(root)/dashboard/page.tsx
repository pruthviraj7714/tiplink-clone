"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface UserInfoType {
  email: string;
  id: string;
  image: string;
  name: string;
  password: string | null;
  provider: "Google";
  solWallet: { publicKey: string };
}
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

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

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status == "unauthenticated" || !session?.user) {
    router.push("/");
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <Card className="mt-24 border shadow-xl border-black/55 w-[760px] p-6">
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
            <div className="flex justify-between my-2 items-center">
              <div className="text-slate-600 font-sans">Your Assets</div>
              <div>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
