import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardHeader } from "./_components/dashboard-header";
import { ParticipantProgress } from "./_components/participant-progress";
import { ProblemStats } from "./_components/problem-stats";
import { RecentSubmissions } from "./_components/recent-submissions";
import { Problem } from "@prisma/client";

const ContestDashboardPage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const contest = await db.contest.findUnique({
    where: {
      id: params.contestId
    },
    include: {
      problems: {
        include: {
          problem: true
        }
      },
      participants: {
        include: {
          user: true
        }
      },
      submissions: {
        include: {
          user: true,
          problem: true
        },
        orderBy: {
          submittedAt: 'desc'
        }
      },
      _count: {
        select: {
          participants: true,
          problems: true,
          submissions: true
        }
      }
    }
  });

  if (!contest) {
    return redirect("/teacher/contests");
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader contest={contest} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParticipantProgress 
          participants={contest.participants}
          problems={contest.problems}
        />
        <ProblemStats 
          problems={contest.problems}
          submissions={contest.submissions}
        />
      </div>
      
      <RecentSubmissions 
        submissions={contest.submissions}
        problems={contest.problems.map((p: { problem: Problem }) => p.problem)}
      />
    </div>
  );
};

export default ContestDashboardPage;