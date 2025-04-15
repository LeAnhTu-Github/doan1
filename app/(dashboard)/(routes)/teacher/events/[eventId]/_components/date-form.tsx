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
  initialData: Event & { date: string | null };
  eventId: string;
}

const formSchema = z.object({
  date: z.string()
});

export const DateForm = ({ initialData, eventId }: DateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: formatDateForInput(initialData.date)
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, {
        date: values.date
      });
      toast.success("Cập nhật ngày thành công");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating date:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật ngày");
    }
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "Chưa có ngày";
    return new Date(date).toLocaleString("vi-VN", {
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
        Ngày diễn ra sự kiện
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa ngày
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
          {initialData.date 
            ? formatDisplayDate(new Date(initialData.date)) 
            : "Chưa có ngày"}
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
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
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
              <Button disabled={!isValid || isSubmitting} type="submit">
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};