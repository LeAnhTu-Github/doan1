import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

// POST create new problem
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const problem = await db.problem.create({
            data: {
                title: body.title,
                difficulty: body.difficulty,
                category: body.category,
                language: body.language,
                time: body.time ? new Date(body.time) : undefined,
                order: body.order,
                problemStatement: body.problemStatement,
                examples: body.examples,
                constraints: body.constraints,
                status: body.status,
                metadata: body.metadata,
                codeTemplate: body.codeTemplate,
                functionName: body.functionName,
                testCases: {
                    create: body.testCases?.map((testCase: any) => ({
                        input: testCase.input,
                        expected: testCase.expected,
                        isHidden: testCase.isHidden || false
                    })) || [],
                },
            },
        });

        return NextResponse.json(problem, { status: 201 });
    } catch (error) {
        console.error('Error creating problem:', error);
        return NextResponse.json(
            { error: 'Failed to create problem' },
            { status: 500 }
        );
    }
}