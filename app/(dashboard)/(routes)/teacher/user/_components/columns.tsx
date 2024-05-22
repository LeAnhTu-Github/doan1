"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  BarChartHorizontal,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import useUpdateModal from "@/hooks/useUpdateModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { on } from "events";

interface DataProps {
  row: {
    original: User;
  };
}
const CeilData = ({ row }: DataProps) => {
  const { id } = row.original;
  const router = useRouter();
  const updateModal = useUpdateModal();
  const onUpdate = () => {
    updateModal.onOpen(id);
  };
  const onDelete = async () => {
    try {
      await axios.delete(`/api/register/${id}`);
      toast.success("Xoá người dùng thành công");
      router.refresh();
    } catch {
      toast.error("Xoá người dùng thất bại");
    } finally {
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-4 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Pencil className="h-4 w-4 mr-2" />
          <button onClick={onUpdate}>Sửa thông tin</button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="h-4 w-4 mr-2" />
          <button onClick={onDelete}>Xoá người dùng</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "masv",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã sinh viên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sinh viên
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
        </Button>
      );
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lớp
        </Button>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Khoa
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hành động
        </Button>
      );
    },
    cell: CeilData,
  },
];
