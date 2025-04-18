// app/(dashboard)/(routes)/teacher/problems/[problemId]/_components/metadata-form.tsx
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MetadataFormProps {
  initialData: {
    metadata: any;
  } | null;
  problemId: string;
}

const formSchema = z.object({
  metadata: z.string().min(1, "Metadata is required"),
});

export const MetadataForm = ({
  initialData,
  problemId,
}: MetadataFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metadata: initialData?.metadata ? JSON.stringify(initialData.metadata, null, 2) : "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const metadata = JSON.parse(values.metadata);
      await axios.patch(`/api/problems/${problemId}`, { metadata });
      toast.success("Metadata đã được cập nhật");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Định dạng JSON không hợp lệ");
      } else {
        toast.error("Đã xảy ra lỗi");
      }
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Metadata
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa metadata
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <pre className="text-sm mt-2 bg-slate-200 rounded-md p-2">
          {JSON.stringify(initialData?.metadata, null, 2)}
        </pre>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Nhập metadata dưới dạng JSON..."
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};