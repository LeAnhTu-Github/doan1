"use client";

import { db } from "@/lib/db";
import { useEffect, useState } from "react";

export const isTeacher = async (userId?: string | null) => {
  try {
    if (!userId) return false;
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    return user?.role === "ADMIN" || user?.role === "MANAGER";
  } catch (error) {
    console.error("Error checking teacher role:", error);
    return false;
  }
}

export const useIsTeacher = (userId?: string | null) => {
  
  const [isTeacherUser, setIsTeacherUser] = useState(false);

  useEffect(() => {
    const checkTeacher = async () => {
      const result = await isTeacher(userId);
      setIsTeacherUser(result);
    };
    checkTeacher();
  }, [userId]);

  return isTeacherUser;
};