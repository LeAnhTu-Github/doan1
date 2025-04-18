import { db } from "@/lib/db";
import { DashboardHeader } from "@/app/(dashboard)/(routes)/teacher/contests/[contestId]/dashboard/_components/dashboard-header";
import { ParticipantProgress } from "@/app/(dashboard)/(routes)/teacher/contests/[contestId]/dashboard/_components/participant-progress";
import { ProblemStats } from "@/app/(dashboard)/(routes)/teacher/contests/[contestId]/dashboard/_components/problem-stats";
import { Problem } from "@prisma/client";
import { redirect } from "next/navigation";

const ContestViewPage = async ({
  params
}: {
  params: { id: string }
}) => {
  const contest = await db.contest.findUnique({
    where: {
      id: params.id
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
    return redirect("/contests");
  }

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
      <DashboardHeader contest={contest} participantCount={contest._count.participants} submissionCount={contest._count.submissions} />
      <ProblemStats 
          problems={contest.problems}
          submissions={validSubmissions}
        /> 
        <ParticipantProgress 
          participants={validParticipants}
          problems={contest.problems}
          submissions={validSubmissions}
        />
    </div>
  );
};

export default ContestViewPage;