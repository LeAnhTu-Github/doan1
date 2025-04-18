import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.string().min(1, "Category is required"),
  language: z.number().default(1),
  problemStatement: z.string().min(1, "Problem statement is required"),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string()
  })).optional(),
  constraints: z.string().optional(),
  metadata: z.object({
    params: z.array(z.object({
      name: z.string(),
      type: z.string(),
      description: z.string()
    })),
    return: z.object({
      type: z.string(),
      description: z.string()
    })
  }).optional(),
  codeTemplate: z.object({
    javascript: z.string(),
    python: z.string(),
    cpp: z.string(),
    java: z.string()
  }).optional(),
  functionName: z.string().optional(),
  status: z.boolean().default(false)
});

export async function GET(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const problem = await db.problem.findUnique({
      where: {
        id: params.problemId
      },
      include: {
        testCases: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!problem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Tạo schema động dựa trên các trường được gửi lên
    const partialProblemSchema = z.object({
      title: z.string().min(1, "Title is required").optional(),
      difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
      category: z.string().min(1, "Category is required").optional(),
      language: z.number().optional(),
      problemStatement: z.string().min(1, "Problem statement is required").optional(),
      examples: z.array(z.object({
        input: z.string(),
        output: z.string()
      })).optional(),
      constraints: z.string().optional(),
      metadata: z.object({
        params: z.array(z.object({
          name: z.string(),
          type: z.string(),
          description: z.string()
        })),
        return: z.object({
          type: z.string(),
          description: z.string()
        })
      }).optional(),
      codeTemplate: z.object({
        javascript: z.string().optional(),
        python: z.string().optional(),
        cpp: z.string().optional(),
        java: z.string().optional(),
        csharp: z.string().optional()
      }).optional(),
      functionName: z.string().optional(),
      status: z.boolean().optional()
    });

    const validatedData = partialProblemSchema.parse(body);

    const problem = await db.problem.update({
      where: {
        id: params.problemId
      },
      data: validatedData
    });

    return NextResponse.json(problem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    console.error("[PROBLEM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.problemId) {
      return new NextResponse("Problem ID is required", { status: 400 });
    }

    // Delete all related records first
    await db.$transaction([
      // Delete all test cases
      db.testCase.deleteMany({
        where: { problemId: params.problemId }
      }),
      // Delete all submissions
      db.submission.deleteMany({
        where: { problemId: params.problemId }
      }),
      // Delete all contest problems
      db.contestProblem.deleteMany({
        where: { problemId: params.problemId }
      }),
      // Finally delete the problem
      db.problem.delete({
        where: { id: params.problemId }
      })
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROBLEMS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}