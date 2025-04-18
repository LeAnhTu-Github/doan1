// app/api/problems/[problemId]/unpublish/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const problem = await db.problem.update({
      where: {
        id: params.problemId
      },
      data: {
        status: false
      }
    });

    return NextResponse.json(problem);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}