import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const testCaseUpdateSchema = z.object({
  input: z.any().optional(),
  expected: z.string().optional(),
  isHidden: z.boolean().optional()
});

export async function PATCH(
  req: Request,
  { params }: { params: { problemId: string; testCaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = testCaseUpdateSchema.parse(body);
    
    const testCase = await db.testCase.update({
      where: {
        id: params.testCaseId
      },
      data: validatedData
    });

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("Error updating test case:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { problemId: string; testCaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.testCase.delete({
      where: {
        id: params.testCaseId
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting test case:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { problemId: string; testCaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const testCase = await db.testCase.findUnique({
      where: {
        id: params.testCaseId
      }
    });

    if (!testCase) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("Error fetching test case:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 