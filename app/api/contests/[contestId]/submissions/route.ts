import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { submitCode, getSubmissionResult, languageMap } from '@/lib/judge0';
import { CodeWrapperService } from '@/lib/codeWrapper'; // Thêm import nếu dùng wrapper

const JUDGE0_HOST = "localhost:2358";
const JUDGE0_PROTOCOL = "http";
const apiHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json"
};

export async function POST(
  request: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contestId } = params;
    const body = await request.json();
    const { problemId, code, language } = body;

    if (!problemId || !code || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const languageId = languageMap[language as keyof typeof languageMap];
    if (!languageId) {
      return NextResponse.json({ error: 'Unsupported programming language' }, { status: 400 });
    }

    const contest = await db.contest.findUnique({ where: { id: contestId } });
    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }
    if (contest.status !== 'upcoming') {
      return NextResponse.json({ error: 'Contest is not active' }, { status: 400 });
    }

    const participant = await db.contestParticipant.findFirst({
      where: {
        AND: [
          { contestId: contestId },
          { userId: userId }
        ]
      }
    });
    if (participant?.finishedAt) {
      return NextResponse.json(
        { error: 'You have already finished this contest and cannot submit anymore' },
        { status: 400 }
      );
    }

    const problem = await db.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }
    if (problem.testCases.length === 0) {
      return NextResponse.json({ error: 'No test cases available for this problem' }, { status: 400 });
    }

    // (Tùy chọn) Bọc code bằng CodeWrapperService nếu cần đồng bộ với handleRun
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

    // Xử lý submission với so sánh stdout và expected
    const results = await Promise.all(
      problem.testCases.map(async (testCase) => {
        try {
          // Use base64 encoding for C++ submissions to avoid character encoding issues
          const useBase64 = language === 'cpp';
          const response = await fetch(`${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=${useBase64}&wait=true`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({
              source_code: sourceCode, // Dùng sourceCode đã bọc (nếu có)
              language_id: languageId,
              stdin: JSON.stringify(testCase.input),
            }),
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.statusText}`);
          }

          const result = await response.json();
          // Kiểm tra stdout có hợp lệ không (không undefined, null, hoặc rỗng)
          const stdout = result.stdout?.trim();
          const isOutputValid = stdout !== undefined && stdout !== null && stdout !== '';
          // So sánh stdout với expected output, chỉ khi output hợp lệ
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

    // Tính toán trạng thái và điểm số
    const allAccepted = results.every((result) => result.status.id === 3);
    const status = allAccepted
      ? 'Accepted'
      : results.find((r) => r.status.id !== 3)?.status.description || 'Error';
    const score = calculateScore(results, problem.testCases.length);

    // Lưu submission vào database
    const submission = await db.submission.upsert({
      where: {
        userId_contestId_problemId: {
          userId: userId,
          contestId: contestId,
          problemId: problemId
        }
      },
      update: {
        code,
        language,
        status,
        score,
        submittedAt: new Date(),
      },
      create: {
        userId: userId,
        contestId: contestId,
        problemId,
        code,
        language,
        status,
        score,
        submittedAt: new Date(),
      },
    });

    // Tính tổng điểm tốt nhất
    const bestScores = await db.submission.groupBy({
      by: ['problemId'],
      where: { userId: userId, contestId: contestId },
      _max: { score: true },
    });
    const totalScore = bestScores.reduce(
      (total, curr) => total + (curr._max.score || 0),
      0
    );

    await db.contestParticipant.update({
      where: {
        contestId_userId: {
          contestId: contestId,
          userId: userId,
        },
      },
      data: {
        finishedAt: new Date(),
        score: totalScore,
      },
    });

    // 2. Lấy lại toàn bộ participant để tính rank
    const allParticipants = await db.contestParticipant.findMany({
      where: { contestId },
      select: {
        userId: true,
        score: true,
        finishedAt: true,
      },
    });

    // 3. Sắp xếp theo score giảm dần, finishedAt tăng dần
    const ranked = allParticipants
      .filter(p => p.finishedAt && p.userId)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (!a.finishedAt) return 1;
        if (!b.finishedAt) return -1;
        return new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime();
      });

    // 4. Cập nhật rank cho từng thí sinh
    await Promise.all(
      ranked.map((p, idx) =>
        db.contestParticipant.update({
          where: {
            contestId_userId: {
              contestId,
              userId: p.userId as string,
            },
          },
          data: { rank: idx + 1 },
        })
      )
    );

    // Trả về kết quả
    return NextResponse.json({
      success: true,
      submission,
      results: {
        status,
        score,
        totalScore,
        testCaseResults: results.map((r, i) => ({
          status: r.status?.description,
          stdout: r.stdout,
          stderr: r.stderr,
          expected: problem.testCases[i].expected,
        })),
      },
    });
  } catch (error: unknown) {
    console.error('Submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function calculateScore(results: any[], totalTestCases: number): number {
  const passedTests = results.filter((r) => r.status.id === 3).length;
  const score = (passedTests / totalTestCases) * 100;
  return Math.round(score); // Làm tròn điểm
}