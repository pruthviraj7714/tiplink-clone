import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
import { Keypair } from "@solana/web3.js";
import { Account, Profile, User } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account }) {
      if (account.provider === "google") {
        const email = user.email;
        if (!email) {
          return false;
        }

        const isUserExist = await prisma.user.findFirst({
          where: {
            email: user?.email as string,
          },
        });

        if (isUserExist) {
          return true;
        }

        const keyPair = Keypair.generate();
        const publicKey = keyPair.publicKey.toBase58();
        const privateKey = keyPair.secretKey.toString();

        await prisma.user.create({
          data: {
            name: user.name as string,
            provider: "Google",
            image: user.image as string,
            email: email,
            solWallet: {
              create: {
                privateKey,
                publicKey,
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        });

        return true;
      }
      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
