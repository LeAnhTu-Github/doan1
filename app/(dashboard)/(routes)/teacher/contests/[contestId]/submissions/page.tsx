import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Submission, User, Problem } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SubmissionWithDetails extends Submission {
  user: {
    name: string | null;
  };
  problem: {
    title: string;
  };
}

const SubmissionsPage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const submissions = await db.submission.findMany({
    where: {
      contestId: params.contestId
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      problem: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  }) as SubmissionWithDetails[];

  if (!submissions.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Không có bài nộp nào</h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Danh sách bài nộp</h1>
      
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {submission.problem.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={submission.status === 'Accepted' ? 'default' : 'destructive'}>
                    {submission.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Người nộp: {submission.user.name || 'Unknown'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {submission.language}
                </Badge>
                <Badge variant="outline">
                  Điểm: {submission.score || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsPage; 