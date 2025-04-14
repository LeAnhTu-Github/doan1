import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema cho dữ liệu cập nhật
const updateSchema = z.object({
  masv: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  class: z.string().min(1, "Class is required"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Invalid email address"), // Để xác định user
});

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { masv, name, class: className, department, email } = updateSchema.parse(body);

    // Tìm user theo email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Cập nhật thông tin user
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        masv,
        name,
        class: className, // Tránh trùng từ khóa 'class' trong JS
        department,
      },
    });

    return NextResponse.json({
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        masv: updatedUser.masv,
        class: updatedUser.class,
        department: updatedUser.department,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}