import React from "react";
import { IoCopy } from "react-icons/io5";
const SectionBox = () => {
  return (
    <div className="w-[35%] h-full bg-white p-5 rounded-3xl bg-[url('/images/noti.jpg')] bg-auto bg-center bg-repeat flex flex-col justify-end">
      <p className="text-white font-semibold text-2xl">Mã tham gia hoạt động</p>
      <div className="w-full h-[40px] bg-white rounded-xl flex justify-between items-center p-4">
        <p className="font-medium">dah527gdu2d</p>
        <IoCopy size={25} className="fill-[#3D8AFF]" />
      </div>
    </div>
  );
};

export default SectionBox;
