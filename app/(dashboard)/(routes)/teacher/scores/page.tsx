import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Problem } from "@prisma/client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const UserPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      {/* <DataTable
        columns={columns}
        data={problemss as Problem[]} // Use the correct Problem type
        users={users}
      /> */}
    </div>
  );
};

export default UserPage;
