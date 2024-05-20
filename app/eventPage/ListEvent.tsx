"use client";
import React from "react";
import { useState } from "react";
import { eventData } from "@/lib/data";
import NewsCard from "@/components/news/NewCard";
import { Event } from "@prisma/client";
interface EventProps {
  events: Event[];
}
const ListEvent = ({ events }: EventProps) => {
  const [itemsToShow, setItemsToShow] = useState(3);

  const handleShowMore = () => {
    setItemsToShow(itemsToShow + 3);
  };
  return (
    <>
      <div className="carousel carousel-end rounded-box w-full h-full gap-8 flex flex-wrap">
        {}
      </div>
      {itemsToShow < eventData.length && (
        <div className="w-full h-auto flex justify-center items-center mt-10">
          {events.slice(0, itemsToShow).map((data, index) => (
            <div className="carousel-item w-[30%]" key={index}>
              <NewsCard event={data} />
            </div>
          ))}
          <button
            className="btn btn-outline btn-error btn-md"
            onClick={handleShowMore}
          >
            Xem thêm
          </button>
        </div>
      )}
    </>
  );
};

export default ListEvent;
