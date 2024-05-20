"use client";
import React from "react";
import { eventData } from "@/lib/data";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import useEventModal from "@/hooks/useEventModal";
import HeartButton from "@/components/ui/HeartButton";
import { Event } from "@prisma/client";
interface EventClientProps {
  data: Event | undefined;
}
const EventClient = ({ data }: EventClientProps) => {
  const eventModal = useEventModal();
  return (
    <>
      <Heading title={data?.name ?? ""} subtitle={data?.date ?? ""} />
      <div className="w-full h-[80vh] overflow-hidden rounded-xl relative">
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
          <div className="flex gap-11 items-end">
            <p>Diễn giả:</p>{" "}
            <p className=" text-xl font-bold">{data?.author ?? ""} </p>
          </div>
          <div className="flex gap-5 items-end">
            <p>Ban tổ chức:</p>{" "}
            <p className=" text-xl font-bold">{data?.host}</p>
          </div>
          <div className="flex gap-11 items-end">
            <p>Địa điểm: </p>{" "}
            <p className=" text-xl font-bold">{data?.address}</p>
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
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                eventModal.onOpen(data?.id ?? "");
              }}
            >
              Đăng kí
            </button>
          </div>
        </div>
      </div>
      <div className="pt-10">
        {data?.description &&
          data.description.split(/[,]/).map((item, index) => (
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
