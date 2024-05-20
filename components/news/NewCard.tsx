"use client";
import React from "react";
import Image from "next/image";
import HeartButton from "../ui/HeartButton";
import { useRouter } from "next/navigation";
import useEventModal from "@/hooks/useEventModal";
import { Event } from "@prisma/client";
interface DataProps {
  event: Event;
}
const NewsCard = ({ event }: DataProps) => {
  const router = useRouter();
  const eventModal = useEventModal();
  return (
    <div className="w-full h-full rounded-3xl border border-[#ccc] px-4 py-4 flex flex-col gap-3">
      <div className="flex gap-4 items-center">
        <div>
          <Image
            src={"/images/avatar.jpeg"}
            alt="Avatar"
            width={35}
            height={35}
            className=" rounded-full"
          />
        </div>
        <p className="text-[#06080F] text-base font-semibold">{event?.title}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[#797D85] text-sm">Diễn giả: {event?.author}</p>
        <p className="text-[#797D85] text-sm">Thời gian: {event?.date}</p>
      </div>
      <div className="flex justify-between w-full h-[36px]">
        <div className="flex gap-2">
          <button
            className="w-[80px] h-full btn btn-outline btn-success btn-sm"
            onClick={() => router.push(`/eventPage/${event?.id}`)}
          >
            Xem
          </button>
          <button
            className="w-[80px] h-full btn btn-outline btn-info btn-sm"
            onClick={() => eventModal.onOpen(event?.id)}
          >
            Đăng kí
          </button>
        </div>
        <div className="flex gap-4 h-full justify-center items-center">
          <HeartButton />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
