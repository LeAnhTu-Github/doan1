"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import RegisterModal from "@/components/modals/RegisterModal";
import EventModal from "@/components/modals/EventModal";
import UpdateModal from "@/components/modals/UpdateModal";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
       <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
       >
         <SessionProvider>
              <ConfettiProvider />
              <ToastProvider />
              <RegisterModal />
              <EventModal />
              <UpdateModal />
              {children}
         </SessionProvider>
       </ThemeProvider>
    );
}