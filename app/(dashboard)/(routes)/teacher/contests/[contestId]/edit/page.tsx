import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ContestForm } from "./_components/contest-form";

const ContestEditPage = async ({
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
    }
  });

  if (!contest) {
    return redirect("/teacher/contests");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Chỉnh sửa cuộc thi
          </h1>
        </div>
      </div>
      <div className="mt-6">
        <ContestForm initialData={contest} />
      </div>
    </div>
  );
};

export default ContestEditPage; 