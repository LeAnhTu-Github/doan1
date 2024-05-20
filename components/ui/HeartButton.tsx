"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { useState } from "react";

const HeartButton = () => {
  const [favorite, setFavorite] = useState(false);
  const toggleFavorite = () => {
    setFavorite((prev) => !prev);
  };
  return (
    <div
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={favorite ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
