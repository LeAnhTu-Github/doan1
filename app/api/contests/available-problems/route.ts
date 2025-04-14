export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const availableProblems = await db.problem.findMany({
      where: {
        mode: true, // Chỉ lấy các problem có mode = true
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
      },
      orderBy: {
        title: 'asc', // Sắp xếp theo tên
      },
    });

    return NextResponse.json(availableProblems);
  } catch (error) {
    console.error("[AVAILABLE_PROBLEMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}