"use client";

import dynamic from "next/dynamic";
import { useMemo, forwardRef } from "react";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
};

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const Editor = forwardRef<HTMLDivElement, EditorProps>(({ onChange, value }, ref) => {
  return (
    <div ref={ref} className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

Editor.displayName = "Editor";
