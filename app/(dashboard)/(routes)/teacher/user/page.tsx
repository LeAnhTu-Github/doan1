import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const UserPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add missing properties to the events array

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} users={users} />
    </div>
  );
};

export default UserPage;
