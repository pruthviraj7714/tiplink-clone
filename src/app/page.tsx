"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handelSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google", { redirect: false });
      if (res?.ok) {
        toast.success("Successfully Signed In");
      }
    } catch (error: any) {
      toast.error("An error occurred during sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-6xl font-bold">
          The crypto of tomorrow,<span className="text-sky-600"> today</span>
        </h1>
        <p className="text-gray-500 my-6 text-2xl text-center">
          Create a frictionless wallet with just a Google Account.
        </p>
        {session?.user ? (
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        ) : (
          <Button
            onClick={handelSignIn}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-8 py-6 w-[200px]"
          >
            <img
              className="w-8 h-8 bg-white rounded p-2"
              src="https://tiplink.io/_next/static/media/google-no-background.207a36b0.svg"
            />
            <p className="font-bold">
              {isLoading ? (
                <div className="flex gap-1.5 items-center">
                  <span>signing in...</span>{" "}
                  <LuLoader2 size={25} className="animate-spin" />
                </div>
              ) : (
                "Sign up with Google"
              )}
            </p>
          </Button>
        )}
      </div>
    </div>
  );
}
