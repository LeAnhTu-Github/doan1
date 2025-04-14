"use client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  subtitleClassName?: string;
}
import React from "react";

const Heading = ({ title, subtitle, center, className, subtitleClassName }: HeadingProps) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className={className || "text-2xl font-bold"}>{title}</div>
      <div className={subtitleClassName || "font-light text-neutral-500 mt-2"}>{subtitle}</div>
    </div>
  );
};

export default Heading;
