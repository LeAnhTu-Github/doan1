import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import { CreateProblemButton } from "./_components/create-problem-button";

const ProblemsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const problems = await db.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Quản lý bài tập</h1>
          <span className="text-sm text-slate-700">
            Tạo và quản lý các bài tập lập trình
          </span>
        </div>
        <CreateProblemButton />
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={problems} />
      </div>
    </div>
  );
};

export default ProblemsPage; 