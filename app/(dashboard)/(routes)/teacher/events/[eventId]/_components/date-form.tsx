"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DateFormProps {
  initialData: Event & { date: Date | null };
  eventId: string;
}

const formSchema = z.object({
  date: z.string().min(1, {
    message: "Vui lòng chọn ngày và giờ cho sự kiện",
  }),
});

export const DateForm = ({ initialData, eventId }: DateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Format Date object for datetime-local input
  const formatDateForInput = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: formatDateForInput(initialData.date),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const dateToSubmit = new Date(values.date);
      if (isNaN(dateToSubmit.getTime())) {
        toast.error("Ngày giờ không hợp lệ");
        return;
      }
      await axios.patch(`/api/events/${eventId}`, {
        date: dateToSubmit.toISOString(),
      });
      toast.success("Cập nhật thời gian sự kiện thành công");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating date:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thời gian sự kiện");
    }
  };

  // Format date for display
  const formatDisplayDate = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) {
      return "Chưa có thời gian";
    }
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Thời gian diễn ra sự kiện
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.date && "text-slate-500 italic"
          )}
        >
          {formatDisplayDate(initialData.date)}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={isSubmitting}
                      {...field}
                      min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                    />
                  </FormControl>
                  <FormDescription>
                    Chọn ngày và giờ diễn ra sự kiện
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};