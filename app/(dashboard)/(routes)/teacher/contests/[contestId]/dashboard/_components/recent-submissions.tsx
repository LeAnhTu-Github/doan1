import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Problem, Submission, User } from "@prisma/client";

interface UserScore {
  user: User;
  totalScore: number;
  problemScores: Record<string, number>;
}

interface RecentSubmissionsProps {
  submissions: (Submission & {
    user: User;
    problem: Problem;
    score: number | null;
  })[];
  problems: (Problem & {
    title: string | null;
  })[];
}

export const RecentSubmissions = ({
  submissions,
  problems
}: RecentSubmissionsProps) => {
  // Tính toán điểm cho mỗi user
  const userScores: UserScore[] = (() => {
    // Map để lưu điểm của từng user
    const scoreMap = new Map<string, UserScore>();
    
    // Duyệt qua tất cả submissions
    submissions.forEach(submission => {
      const userId = submission.user.id;
      if (!scoreMap.has(userId)) {
        scoreMap.set(userId, {
          user: submission.user,
          totalScore: 0,
          problemScores: {}
        });
      }

      const userScore = scoreMap.get(userId)!;
      userScore.problemScores[submission.problem.id] = submission.score ?? 0;
      // Cập nhật tổng điểm
      userScore.totalScore = Object.values(userScore.problemScores)
        .reduce((sum, score) => sum + score, 0);
    });

    return Array.from(scoreMap.values());
  })();

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Bảng điểm thí sinh</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thí sinh</TableHead>
            {problems.map((_, index) => (
              <TableHead key={problems[index].id} className="text-center">
                Bài {index + 1}
              </TableHead>
            ))}
            <TableHead className="text-center font-bold">Tổng điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userScores.map((userScore) => (
            <TableRow key={userScore.user.id}>
              <TableCell>{userScore.user.name}</TableCell>
              {problems.map(problem => (
                <TableCell key={problem.id} className="text-center">
                  {userScore.problemScores[problem.id]?.toFixed(2) ?? '-'}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold">
                {userScore.totalScore.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};