'use client'

import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { LucideLoader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { data: session } = useSession()

  if (session && session.user) {
    redirect('/dashboard')
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    const res = await signIn("google", { redirect: false })
    if (res?.ok) {
      toast.success("Successfully Signed In")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <main className="flex-grow container mt-40 mx-auto px-4 pt-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              The crypto of tomorrow,{" "}
              <span className="text-sky-600">today</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create a frictionless wallet with just a Google Account.
              Secure, simple, and ready for the future of finance.
            </p>
            {!session?.user && (
              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LucideLoader2 className="animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://tiplink.io/_next/static/media/google-no-background.207a36b0.svg"
                      alt="Google logo"
                      width={24}
                      height={24}
                      className="bg-white rounded p-1"
                    />
                    <span>Sign up with Google</span>
                  </div>
                )}
              </Button>
            )}
          </div>
          <div className="w-full max-w-lg">
            <img
              src="https://mir-s3-cdn-cf.behance.net/projects/max_808/7a82b570553079.Y3JvcCw4MDgsNjMyLDAsMA.png"
              alt="Crypto illustration"
              width={640}
              height={500}
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </main>
    </div>
  )
}