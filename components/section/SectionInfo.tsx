import React from "react";
import Avatar from "../Avatar";
import { db } from "@/lib/db";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  imageUrl: string | null;
}

interface SidebarProps {
  currentUser?: User | null;
}

const SectionInfo = async ({ currentUser }: SidebarProps) => {
  const user = currentUser;

  const courses = await db.courseRegister.findMany({
    where: {
      userId: user?.id,
    },
  });
  const events = await db.userRegister.findMany({
    where: {
      userId: user?.id,
    },
  });
  const problems = await db.practiceSubmission.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="w-[65%] h-full bg-white p-5 rounded-3xl flex flex-col">
      <div className="h-2/5 w-full flex gap-4 items-center">
        <div>
          <Avatar src={currentUser?.imageUrl || ""} />
        </div>
        <div className="flex flex-col justify-start pt-2 gap-1">
          <p className="text-sm font-bold text-[#06080F]">
            {currentUser?.name || "Tài khoản khách"} -
          </p>
          <p className="text-xs font-semibold text-[#797D85] opacity-50">
            {currentUser?.email || "Chưa được đăng nhập"}
          </p>
        </div>
      </div>

      {/* Info boxes */}
      <div className="w-full h-1/2 flex gap-2">
        <div
          className="w-1/3 h-full bg-[url('/images/nav1.jpg')] bg-[length:150%] bg-center bg-no-repeat rounded-[20px] p-2 flex flex-col"
        >
          <p className="text-[#797D85] text-sm font-medium">
            Số khoá học đã tham gia
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {courses.length || 0}
          </p>
        </div>
        <div
          className="w-1/3 h-full bg-[url('/images/nav2.jpg')] bg-[length:150%] bg-center bg-no-repeat rounded-[20px] p-2 flex flex-col"
        >
          <p className="text-[#797D85] text-sm font-medium">
            Số sự kiện đang đăng kí
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {events.length || 0}
          </p>
        </div>
        <div
          className="w-1/3 h-full bg-[url('/images/nav3.jpg')] bg-[length:150%] bg-center bg-no-repeat rounded-[20px] p-2 flex flex-col"
        >
          <p className="text-[#797D85] text-sm font-medium">
            Bài tập đã làm
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {problems.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionInfo;