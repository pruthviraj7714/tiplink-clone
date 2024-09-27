import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized User",
        },
        { status: 403 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email as string,
      },
      include: {
        solWallet: {
          select: {
            publicKey: true,
          },
        },
      },
    });

    return NextResponse.json({
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
