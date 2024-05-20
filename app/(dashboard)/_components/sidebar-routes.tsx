"use client";

import {
  BarChart,
  Compass,
  List,
  CalendarRange,
  Home,
  BookMarked,
  ScrollText,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Home,
    label: "Trang chủ",
    href: "/",
  },
  {
    icon: CalendarRange,
    label: "Sự kiện",
    href: "/eventPage",
  },
  {
    icon: BookMarked,
    label: "Khoá học",
    href: "/search",
  },
  {
    icon: ScrollText,
    label: "Kiểm tra",
    href: "/test",
  },
];

const teacherRoutes = [
  {
    icon: BarChart,
    label: "Người dùng",
    href: "/teacher/analytics",
  },
  {
    icon: List,
    label: "Khoá học",
    href: "/teacher/courses",
  },
  {
    icon: CalendarRange,
    label: "Sự kiện",
    href: "/teacher/events",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full rounded-3xl">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
