import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const ScorePage = async ({ params }: { params: { scoreId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const scoresUser = await db.score.findMany({
    where: {
      testId: params.scoreId,
    },
  });

  // Add missing properties to the events array

  return (
    <div className="p-6">
      <DataTable columns={columns} data={scoresUser} users={scoresUser} />
    </div>
  );
};

export default ScorePage;
