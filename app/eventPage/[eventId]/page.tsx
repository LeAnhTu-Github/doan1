import React from "react";
import ClientOnly from "@/components/ClientOnly";
import EventClient from "./EventClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
interface IParams {
  eventId?: string;
}
const page = async ({ params }: { params: IParams }) => {
  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
  const regis = await db.userRegister.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const data = events.find((event) => event.id === params.eventId);
  return (
    <div className="max-w-[2520px] mx-auto ">
      <div className="w-full h-auto rounded-3xl flex flex-col gap-4 bg-white p-10">
        <EventClient data={data} userId={userId} regis={regis} />
      </div>
    </div>
  );
};

export default page;
