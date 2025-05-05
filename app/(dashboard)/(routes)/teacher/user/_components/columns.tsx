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
  UserCog,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import useUpdateModal from "@/hooks/useUpdateModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { on } from "events";
import { useSession } from "next-auth/react";

interface DataProps {
  row: {
    original: User;
  };
}

const CeilData = ({ row }: DataProps) => {
  const { data: session } = useSession();
  const { id, role: currentRole } = row.original;
  const router = useRouter();
  const updateModal = useUpdateModal();

  const isAdmin = session?.user?.role === "ADMIN";

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
    }
  };

  const onUpdateRole = async (newRole: string) => {
    try {
      await axios.patch(`/api/register/${id}`, { role: newRole });
      toast.success("Cập nhật role thành công");
      router.refresh();
    } catch {
      toast.error("Cập nhật role thất bại");
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
        <DropdownMenuItem onClick={onUpdate}>
          <Pencil className="h-4 w-4 mr-2" />
          Sửa thông tin
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserCog className="h-4 w-4 mr-2" />
              Thay đổi role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => onUpdateRole("MANAGER")}
                className={currentRole === "MANAGER" ? "bg-slate-100" : ""}
              >
                MANAGER
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onUpdateRole("USER")}
                className={currentRole === "USER" ? "bg-slate-100" : ""}
              >
                USER
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <DropdownMenuItem onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Xoá người dùng
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
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: (cellProps) => <CeilData {...cellProps} />,
  },
];
