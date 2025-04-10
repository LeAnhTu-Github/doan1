import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardHeader } from "./_components/dashboard-header";
import { ParticipantProgress } from "./_components/participant-progress";
import { ProblemStats } from "./_components/problem-stats";
import { RecentSubmissions } from "./_components/recent-submissions";
import { Problem } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const ContestDashboardPage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
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

  // Filter out participants and submissions with null users
  const validParticipants = contest.participants.filter(
    (participant): participant is typeof participant & { user: NonNullable<typeof participant.user> } => 
    participant.user !== null
  );

  const validSubmissions = contest.submissions.filter(
    (submission): submission is typeof submission & { user: NonNullable<typeof submission.user> } => 
    submission.user !== null
  );

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader contest={contest} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParticipantProgress 
          participants={validParticipants}
          problems={contest.problems}
          submissions={validSubmissions}
        />
        <ProblemStats 
          problems={contest.problems}
          submissions={validSubmissions}
        />
      </div>
      
      <RecentSubmissions 
        submissions={validSubmissions}
        problems={contest.problems.map((p: { problem: Problem }) => p.problem)}
      />
    </div>
  );
};

export default ContestDashboardPage;