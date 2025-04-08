import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs";
import { languageMap } from '@/lib/judge0';
import { CodeWrapperService } from '@/lib/codeWrapper';
import { db } from '@/lib/db'; // Import db từ lib/db

const JUDGE0_HOST = "localhost:2358";
const JUDGE0_PROTOCOL = "http";
const apiHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json"
};

export async function POST(
  request: NextRequest,
  { params }: { params: { problemId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId } = params;
    const body = await request.json();
    const { code, language } = body;

    if (!problemId || !code || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const languageId = languageMap[language as keyof typeof languageMap];
    if (!languageId) {
      return NextResponse.json({ error: 'Unsupported programming language' }, { status: 400 });
    }

    // Fetch problem and test cases
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return NextResponse.json({ error: 'No test cases available' }, { status: 400 });
    }

    // Wrap code if metadata exists
    let sourceCode = code;
    const metadata = typeof problem.metadata === 'string' 
      ? JSON.parse(problem.metadata) 
      : problem.metadata;
    if (metadata && problem.functionName) {
      sourceCode = CodeWrapperService.generateWrapper(
        code,
        language,
        metadata,
        problem.functionName
      );
    }

    // Execute code against all test cases with improved validation
    const results = await Promise.all(
      problem.testCases.map(async (testCase) => {
        try {
          const response = await fetch(`${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=true`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({
              source_code: sourceCode,
              language_id: languageId,
              stdin: JSON.stringify(testCase.input),
            }),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.statusText}`);
          }

          const result = await response.json();
          // Validate stdout and compare with expected output
          const stdout = result.stdout?.trim();
          const isOutputValid = stdout !== undefined && stdout !== null && stdout !== '';
          const isCorrect = result.status?.id === 3 && isOutputValid && stdout === testCase.expected?.trim();
          
          return {
            ...result,
            status: {
              id: isCorrect ? 3 : 4, // 3: Accepted, 4: Wrong Answer
              description: isCorrect ? 'Accepted' : 'Wrong Answer',
            },
          };
        } catch (error) {
          console.error('Submission error:', error);
          return {
            status: {
              id: 500,
              description: 'Submission Error'
            },
            stderr: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Calculate status and score
    const allAccepted = results.every((result) => result.status.id === 3);
    const status = allAccepted
      ? 'Accepted'
      : results.find((r) => r.status.id !== 3)?.status.description || 'Error';
    const score = calculateScore(results, problem.testCases.length);

    // Trước khi tạo submission mới, lấy submission cũ để so sánh điểm
    const existingSubmission = await db.practiceSubmission.findUnique({
      where: {
        clerkUserId_problemId: {
          clerkUserId: userId,
          problemId: problemId,
        },
      },
    });

    // Lấy thông tin ranking hiện tại của user
    const allSubmissions = await db.practiceSubmission.findMany({
      where: { clerkUserId: userId },
    });

    // Tính tổng điểm từ các submission của các bài khác
    const otherSubmissionsScore = allSubmissions
      .filter(sub => sub.problemId !== problemId)
      .reduce((sum, sub) => sum + (sub.score || 0), 0);

    // Tổng điểm mới = điểm các bài khác + điểm bài hiện tại
    const totalScore = otherSubmissionsScore + score;

    // Tính lại số bài đã giải
    const solvedCount = allSubmissions
      .filter(sub => sub.problemId !== problemId) // Loại bỏ bài hiện tại
      .filter(sub => sub.status === 'Accepted')
      .length + (status === 'Accepted' ? 1 : 0); // Cộng thêm 1 nếu bài hiện tại Accepted

    // Chỉ cập nhật nếu điểm mới cao hơn hoặc chưa có submission cũ
    const shouldUpdate = !existingSubmission || score > (existingSubmission.score || 0);

    let submission;
    if (shouldUpdate) {
      // Chỉ tạo/cập nhật submission khi điểm cao hơn
      submission = await db.practiceSubmission.upsert({
        where: {
          clerkUserId_problemId: {
            clerkUserId: userId,
            problemId: problemId,
          },
        },
        update: {
          code,
          language,
          status,
          score,
          submittedAt: new Date(),
        },
        create: {
          clerkUserId: userId,
          problemId,
          code,
          language,
          status,
          score,
        },
      });

      // Update user ranking chỉ khi có điểm cao hơn
      await db.userRanking.upsert({
        where: { clerkUserId: userId },
        update: {
          totalScore,
          solvedCount,
        },
        create: {
          clerkUserId: userId,
          totalScore,
          solvedCount,
        },
      });
    }

    return NextResponse.json({
      success: true,
      results: {
        status: status, // Luôn hiển thị trạng thái mới
        score: score, // Luôn hiển thị điểm số mới
        highestScore: existingSubmission?.score || score, // Hiển thị điểm cao nhất đã đạt được
        totalScore, // Đã được định nghĩa ở trên
        solvedCount, // Đã được định nghĩa ở trên
        testCaseResults: results.map((r, i) => ({
          status: r.status?.description,
          stdout: r.stdout,
          stderr: r.stderr,
          expected: problem.testCases[i].expected,
        })),
      },
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateScore(results: any[], totalTestCases: number): number {
  const passedTests = results.filter((r) => r.status.id === 3).length;
  const score = (passedTests / totalTestCases) * 100;
  return Math.round(score); // Làm tròn điểm
}

export async function GET(
  request: NextRequest,
  { params }: { params: { problemId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId } = params;
    const submission = await db.practiceSubmission.findFirst({
      where: {
        clerkUserId: userId,
        problemId: problemId,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}