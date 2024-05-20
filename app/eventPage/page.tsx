import React from "react";
import ListEvent from "./ListEvent";
import { db } from "@/lib/db";
const NewsPage = async () => {
  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="w-full h-auto bg-white p-7 rounded-3xl flex flex-col gap-4 mt-4">
      <div className="flex gap-4 items-center">
        <div className="w-5 h-9 rounded-md bg-[#FF9159]"></div>
        <p className="text-[#06080F] text-2xl font-semibold">
          Danh sách sự kiện
        </p>
      </div>
      <div className="w-full h-full pt-8">
        <ListEvent events={events} />
      </div>
    </div>
  );
};

export default NewsPage;
