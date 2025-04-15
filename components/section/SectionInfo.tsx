import React from "react";
import Avatar from "../Avatar";

interface SidebarProps {
  currentUser?: any | null; // Bạn có thể định nghĩa type cụ thể hơn dựa trên dữ liệu từ NextAuth
}

const SectionInfo = ({ currentUser }: SidebarProps) => {
  return (
    <div className="w-[65%] h-full bg-white p-5 rounded-3xl flex flex-col">
      <div className="h-2/5 w-full flex gap-4 items-center">
        <div>
          <Avatar src={currentUser?.imageUrl || ""} /> 
        </div>
        <div className="flex flex-col justify-start pt-2 gap-1">
          <p className="text-sm font-bold text-[#06080F]">
            {currentUser?.name || "Guest User"} {/* NextAuth trả về name */}
          </p>
          <p className="text-xs font-semibold text-[#797D85] opacity-50">
            {currentUser?.email || "Not signed in"} {/* NextAuth trả về email */}
          </p>
        </div>
      </div>

      {/* Phần các box thông tin */}
      <div className="w-full h-1/2 flex gap-2">
        <div className="w-1/3 h-full bg-[url('/images/nav1.jpg')] bg-auto bg-center bg-repeat rounded-[20px] p-2 flex flex-col">
          <p className="text-[#797D85] text-sm font-medium">
            Số khoá học đã tham gia
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {currentUser?.courses?.length || 3} {/* Giả sử có field courses */}
          </p>
        </div>
        <div className="w-1/3 h-full bg-[url('/images/nav2.jpg')] bg-auto bg-center bg-repeat rounded-[20px] p-2 flex flex-col">
          <p className="text-[#797D85] text-sm font-medium">
            Số sự kiện đang đăng kí
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {currentUser?.events?.length || 8} {/* Giả sử có field events */}
          </p>
        </div>
        <div className="w-1/3 h-full bg-[url('/images/nav3.jpg')] bg-auto bg-center bg-repeat rounded-[20px] p-2 flex flex-col">
          <p className="text-[#797D85] text-sm font-medium">
            Bài tập đã làm
          </p>
          <p className="text-[#06080F] text-2xl font-semibold pt-2">
            {currentUser?.problems?.length || 2} {/* Giả sử có field tests */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionInfo;