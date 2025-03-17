"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import RegisterModal from "@/components/modals/RegisterModal";
import EventModal from "@/components/modals/EventModal";
import UpdateModal from "@/components/modals/UpdateModal";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ConfettiProvider />
            <ToastProvider />
            <RegisterModal />
            <EventModal />
            <UpdateModal />
            {children}
        </ClerkProvider>
    );
}
