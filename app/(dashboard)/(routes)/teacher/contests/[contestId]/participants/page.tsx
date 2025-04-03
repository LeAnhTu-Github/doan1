import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const ContestParticipantsPage = async ({
  params
}: {
  params: { contestId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const participants = await db.contestParticipant.findMany({
    where: {
      contestId: params.contestId
    },
    include: {
      user: true,
    },
    orderBy: {
      score: 'desc'
    }
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={participants} />
    </div>
  );
};

export default ContestParticipantsPage;
