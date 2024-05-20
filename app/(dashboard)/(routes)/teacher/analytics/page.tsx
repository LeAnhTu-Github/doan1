import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

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

  // Add missing properties to the events array
  const updatedEvents = users.map((event) => ({
    ...event,
    price: null,
    categoryId: null,
    id: "", // Add the missing properties
    userId: "",
    title: "",
    description: null,
    imageUrl: null,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return (
    <div className="p-6">
      <DataTable columns={columns} data={updatedEvents} users={users} />
    </div>
  );
};

export default UserPage;
