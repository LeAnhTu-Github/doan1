import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./_components/columns";
import Link from "next/link";
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
        <Link href="/teacher/problems/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài tập mới
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={problems} />
      </div>
    </div>
  );
};

export default ProblemsPage; 