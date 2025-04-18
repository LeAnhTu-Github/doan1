import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const testCaseSchema = z.object({
  input: z.any(),
  expected: z.string(),
  isHidden: z.boolean().default(false)
});

export async function POST(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = testCaseSchema.parse(body);
    const testCase = await db.testCase.create({
      data: {
        ...validatedData,
        problemId: params.problemId,
        input: validatedData.input ?? null // Ensure input is always provided
      }
    });

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("Error creating test case:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const testCases = await db.testCase.findMany({
      where: {
        problemId: params.problemId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(testCases);
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}