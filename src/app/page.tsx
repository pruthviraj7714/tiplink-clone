"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-6xl font-bold">The crypto of tomorrow,<span className="text-sky-600"> today</span></h1>
        <p className="text-gray-500 my-6 text-2xl text-center">Create a frictionless wallet with just a Google Account.</p>
        <Button onClick={async () =>
          await signIn("google", {redirect : false})
        } className="flex items-center gap-1.5 px-8 py-6 w-[200px]">
         <img className="w-8 h-8 bg-white rounded p-2" src="https://tiplink.io/_next/static/media/google-no-background.207a36b0.svg" /> 
         <p className="font-bold">Sign up with Google</p>
        </Button>
      </div>
    </div>
  );
}
