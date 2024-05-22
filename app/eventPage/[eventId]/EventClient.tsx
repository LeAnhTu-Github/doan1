"use client";
import React from "react";
import { eventData } from "@/lib/data";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import useEventModal from "@/hooks/useEventModal";
import HeartButton from "@/components/ui/HeartButton";
import { Event } from "@prisma/client";
import { userRegister } from "@prisma/client";
interface EventClientProps {
  data: Event | undefined;
  regis: userRegister[];
  userId: string | null;
}
const EventClient = ({ data, regis, userId }: EventClientProps) => {
  const eventModal = useEventModal();
  let check = false;
  if (
    data &&
    regis.some(
      (reg) =>
        reg.eventId === data.id && reg.userId === userId && reg.isRegister
    )
  ) {
    check = true;
  }
  return (
    <>
      <Heading title={data?.name ?? ""} subtitle={data?.date ?? ""} />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          src={data?.imageUrl ?? ""}
          alt="Image"
          fill
          className=" object-cover w-full"
        />
        <div className="absolute top-5 right-5">
          <HeartButton />
        </div>
      </div>
      <div className="w-full h-auto flex justify-between pr-10">
        <div className="w-3/5 flex flex-col h-full gap-3">
          <div className="flex gap-12 items-end">
            <p className="text-xl">Diễn giả:</p>{" "}
            <p className=" text-xl ">{data?.author ?? ""} </p>
          </div>
          <div className="flex gap-5 items-end">
            <p className="text-xl">Ban tổ chức:</p>{" "}
            <p className=" text-xl">{data?.host}</p>
          </div>
          <div className="flex gap-12 items-end">
            <p className="text-xl">Địa điểm: </p>{" "}
            <p className=" text-xl">{data?.address}</p>
          </div>
        </div>
        <div className="w-2/5 h-full flex flex-end">
          <div
            className="
            w-full h-full
            flex flex-col justify-center items-center gap-5 border border-solid border-[#3D8AFF] rounded-2xl shadow-lg p-2
            
          "
          >
            <p>Thòi gian còn lại: 12d : 3h : 24m</p>
            {check ? (
              <button className="btn btn-outline btn-success">
                Bạn đã đăng kí sự kiện này rồi
              </button>
            ) : (
              <button
                className="btn btn-outline btn-info"
                onClick={() => {
                  eventModal.onOpen(data?.id ?? "");
                }}
              >
                Đăng kí
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="pt-10">
        {data?.description &&
          data.description.split(/[\n]/).map((item, index) => (
            <>
              <p key={index}>{item}</p>
              <br />
            </>
          ))}
      </div>
    </>
  );
};

export default EventClient;
