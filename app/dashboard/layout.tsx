"use client";
import { CommandMenu } from "@/components/command-menu";
import AppHeader from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar />
      <CommandMenu />
      <SidebarInset className="flex flex-col h-screen w-screen overflow-hidden">
        <AppHeader />
        <div className="w-full flex flex-1 flex-col gap-4 p-4 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
