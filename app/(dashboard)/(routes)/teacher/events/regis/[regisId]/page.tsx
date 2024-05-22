import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const RegisPage = async ({ params }: { params: { regisId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const regisUser = await db.userRegister.findMany({
    where: {
      eventId: params.regisId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={regisUser} users={regisUser} />
    </div>
  );
};

export default RegisPage;
