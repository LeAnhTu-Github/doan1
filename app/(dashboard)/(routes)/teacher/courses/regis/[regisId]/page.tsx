import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const RegisPage = async ({ params }: { params: { regisId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const regisUser = await db.courseRegister.findMany({
    where: {
      courseId: params.regisId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add missing properties to the events array
  const updatedEvents = regisUser.map((event) => ({
    ...event,
    price: null,
    categoryId: null,
    title: "", // Add the missing property 'title'
    description: null, // Add the missing property 'description'
    imageUrl: null, // Add the missing property 'imageUrl'
    isPublished: false, // Add the missing property 'isPublished'
    eventId: "", // Add the missing property 'eventId'
    question: null, // Add the missing property 'question'
  }));

  return (
    <div className="p-6">
      <DataTable columns={columns} data={updatedEvents} users={regisUser} />
    </div>
  );
};

export default RegisPage;
