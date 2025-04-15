"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Trash, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TestCasesFormProps {
  initialData: {
    id: string;
    testCases: {
      id: string;
      input: any;
      expected: string;
      isHidden: boolean;
    }[];
  } | null;
  problemId: string;
}

const formSchema = z.object({
  input: z.string().min(1, {
    message: "Input là bắt buộc",
  }),
  expected: z.string().min(1, {
    message: "Output mong đợi là bắt buộc",
  }),
  isHidden: z.boolean().default(false),
  inputType: z.string().min(1, {
    message: "Loại input là bắt buộc",
  }),
});

const inputTypes = [
  { label: "Số nguyên", value: "number" },
  { label: "Mảng số nguyên", value: "number[]" },
  { label: "Chuỗi", value: "string" },
  { label: "Mảng chuỗi", value: "string[]" },
  { label: "Ma trận số nguyên", value: "number[][]" },
  { label: "Ma trận chuỗi", value: "string[][]" },
  { label: "Boolean", value: "boolean" },
  { label: "Mảng boolean", value: "boolean[]" },
  { label: "JSON", value: "json" },
];

export const TestCasesForm = ({ initialData, problemId }: TestCasesFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testCases, setTestCases] = useState(initialData?.testCases || []);
  const [inputType, setInputType] = useState("number[]");
  const [openTestCases, setOpenTestCases] = useState<string[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
      expected: "",
      isHidden: false,
      inputType: "number[]",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Parse input based on input type
      let parsedInput;
      try {
        if (values.inputType === "json") {
          parsedInput = JSON.parse(values.input);
        } else if (values.inputType.includes("[]")) {
          // Handle array inputs
          parsedInput = JSON.parse(values.input);
        } else if (values.inputType === "number") {
          parsedInput = Number(values.input);
        } else if (values.inputType === "boolean") {
          parsedInput = values.input.toLowerCase() === "true";
        } else {
          parsedInput = values.input;
        }
      } catch (error) {
        toast.error("Định dạng input không hợp lệ");
        return;
      }

      // Create new test case
      const response = await axios.post(`/api/problems/${problemId}/test-cases`, {
        input: parsedInput,
        expected: values.expected,
        isHidden: values.isHidden,
      });

      setTestCases([...testCases, response.data]);
      toast.success("Test case đã được thêm");
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const onDelete = async (testCaseId: string) => {
    try {
      await axios.delete(`/api/problems/${problemId}/test-cases/${testCaseId}`);
      setTestCases(testCases.filter((testCase) => testCase.id !== testCaseId));
      toast.success("Test case đã được xóa");
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const toggleHidden = async (testCaseId: string, isHidden: boolean) => {
    try {
      await axios.patch(`/api/problems/${problemId}/test-cases/${testCaseId}`, {
        isHidden,
      });
      setTestCases(
        testCases.map((testCase) =>
          testCase.id === testCaseId
            ? { ...testCase, isHidden }
            : testCase
        )
      );
      toast.success("Test case đã được cập nhật");
      router.refresh();
    } catch {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const toggleTestCase = (testCaseId: string) => {
    setOpenTestCases(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  const renderInputField = () => {
    const inputType = form.watch("inputType");
    
    if (inputType === "json" || inputType.includes("[]")) {
      return (
        <Textarea
          disabled={isSubmitting}
          placeholder="Nhập input dưới dạng JSON..."
          className="min-h-[100px] font-mono"
          {...form.register("input")}
        />
      );
    } else {
      return (
        <Input
          disabled={isSubmitting}
          placeholder="Nhập input..."
          {...form.register("input")}
        />
      );
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Test Cases
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Plus className="h-4 w-4 mr-2" />
              Thêm test case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm test case mới</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="inputType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại input</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setInputType(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại input" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inputTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
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
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input</FormLabel>
                      <FormControl>
                        {renderInputField()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output mong đợi</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Nhập output mong đợi..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isHidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ẩn test case</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Test case ẩn sẽ không hiển thị cho sinh viên
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2 justify-end pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    disabled={!isValid || isSubmitting} 
                    type="submit"
                  >
                    Thêm
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 space-y-4">
        {testCases.map((testCase) => (
          <Card key={testCase.id}>
            <Collapsible
              open={openTestCases.includes(testCase.id)}
              onOpenChange={() => toggleTestCase(testCase.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                        <ChevronDown 
                          className={`h-4 w-4 transform transition-transform duration-200 ${
                            openTestCases.includes(testCase.id) ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CardTitle className="text-sm font-medium">
                      Test Case {testCases.indexOf(testCase) + 1}
                      {testCase.isHidden && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Ẩn)
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`hidden-${testCase.id}`}
                        checked={testCase.isHidden}
                        onCheckedChange={(checked) => 
                          toggleHidden(testCase.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`hidden-${testCase.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Ẩn
                      </label>
                    </div>
                    <Button
                      onClick={() => onDelete(testCase.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Input:</p>
                      <pre className="bg-slate-100 p-2 rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(testCase.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Output mong đợi:</p>
                      <pre className="bg-slate-100 p-2 rounded-md text-sm overflow-x-auto">
                        {testCase.expected}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}; 