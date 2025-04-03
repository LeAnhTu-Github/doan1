import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const contests = await db.contest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          participants: true,
          problems: true,
        }
      }
    }
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={contests} />
    </div>
  );
};

export default CoursesPage;
