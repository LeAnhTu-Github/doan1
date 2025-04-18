import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// GET all problems or by specific query
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');

        const problems = await db.problem.findMany({
            where: {
                ...(category && { category }),
                ...(difficulty && { difficulty }),
            },
            include: {
                testCases: true,
                contestProblems: true,
                submissions: true,
            },
        });

        return NextResponse.json(problems, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch problems' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Tạo problem mới với các giá trị mặc định
        const problem = await db.problem.create({
            data: {
                title: "Bài tập mới",
                difficulty: "Easy",
                category: "Array",
                language: 1,
                problemStatement: "",
                functionName: "",
                status: false,
                examples: "",
                constraints: "",
                metadata: {
                    params: [],
                    return: {
                        type: "",
                        description: ""
                    }
                },
                codeTemplate: {
                    javascript: "",
                    python: "",
                    cpp: "",
                    java: "",
                    csharp: ""
                }
            }
        });

        return NextResponse.json(problem);
    } catch (error) {
        console.error("[PROBLEMS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}