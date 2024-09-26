"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="flex justify-between items-center border-b h-16 p-4 border-black/55">
      <div className="text-xl font-bold">TipLink</div>
      {session?.user ? (
        <div>
          <Button variant={"destructive"} onClick={async() => {
            await signOut({redirect:false});
            router.push('/');
          }}>Log out</Button>
        </div>
      ) : (
        <div>
          <Button
          className="flex items-center gap-1.5 py-5"
            onClick={async () => {
              await signIn("google", { redirect: false });
            }}
          >
            <img src="https://tiplink.io/_next/static/media/google-no-background.207a36b0.svg" className="w-8 h-8 p-2 bg-white rounded" />
            <p>Login</p>
          </Button>
        </div>
      )}
    </div>
  );
}
