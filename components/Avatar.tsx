"use client";
import Image from "next/image";

interface AvatarProps {
  width?: number;
  height?: number;
  src: string | null | undefined;
}
const Avatar = ({ src, width, height }: AvatarProps) => {
  return (
    <Image
      src={src || "/images/placeholder.jpg"}
      alt="Avatar"
      width={width || 30}
      height={height || 30}
      className="rounded-full"
    />
  );
};

export default Avatar;
