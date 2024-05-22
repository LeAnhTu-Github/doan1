"use client";
import React from "react";
import { useState } from "react";
import { eventData } from "@/lib/data";
import NewsCard from "@/components/news/NewCard";
import { Event } from "@prisma/client";
import { userRegister } from "@prisma/client";
interface EventProps {
  regis: userRegister[];
  userId: string | null;
  events: Event[];
}
const ListEvent = ({ events, userId, regis }: EventProps) => {
  const [itemsToShow, setItemsToShow] = useState(4);

  const handleShowMore = () => {
    setItemsToShow(itemsToShow + 4);
  };
  return (
    <>
      {events.length > itemsToShow && itemsToShow < events.length ? (
        <div className="w-full h-4/5 pt-8">
          <div className=" rounded-box w-full h-full gap-8 flex flex-wrap">
            {events.slice(0, itemsToShow).map((data, index) => (
              <div className="w-[22%]" key={index}>
                <NewsCard event={data} userId={userId} regis={regis} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              className="btn btn-outline btn-error btn-md"
              onClick={handleShowMore}
            >
              Xem thêm
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-4/5 pt-8">
          <div className=" rounded-box w-full h-full gap-8 flex flex-wrap">
            {events.slice(0, itemsToShow).map((data, index) => (
              <div className="w-[22%]" key={index}>
                <NewsCard event={data} userId={userId} regis={regis} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ListEvent;
