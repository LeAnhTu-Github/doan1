// app/(dashboard)/(routes)/teacher/problems/[problemId]/_components/code-template-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeTemplateFormProps {
  initialData: {
    codeTemplate: {
      javascript?: string;
      python?: string;
      cpp?: string;
      java?: string;
    };
  } | null;
  problemId: string;
}

const formSchema = z.object({
  language: z.string().min(1, "Language is required"),
  template: z.string().min(1, "Template is required"),
});

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
];

export const CodeTemplateForm = ({
  initialData,
  problemId,
}: CodeTemplateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "javascript",
      template: initialData?.codeTemplate?.javascript || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const codeTemplate = {
        ...initialData?.codeTemplate,
        [values.language]: values.template,
      };
      
      await axios.patch(`/api/problems/${problemId}`, { codeTemplate });
      toast.success("Code template updated");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    form.setValue("language", language);
    form.setValue("template", initialData?.codeTemplate?.[language as keyof typeof initialData.codeTemplate] || "");
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Mẫu code
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa mẫu code
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="mt-4">
          {languages.map((lang) => (
            <div key={lang.value} className="mb-4">
              <h3 className="text-sm font-medium mb-2">{lang.label}</h3>
              <pre className="text-sm bg-slate-200 rounded-md p-2">
                {initialData?.codeTemplate?.[lang.value as keyof typeof initialData.codeTemplate] || "No template"}
              </pre>
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={onLanguageChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Nhập mẫu code..."
                      className="font-mono min-h-[200px]"
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