import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const EventPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add missing properties to the events array
  const updatedEvents = events.map((event) => ({
    ...event,
    price: null,
    categoryId: null,
  }));

  return (
    <div className="p-6">
      <DataTable columns={columns} data={updatedEvents} />
    </div>
  );
};

export default EventPage;
