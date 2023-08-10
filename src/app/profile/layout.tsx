import "../globals.css";
import type { Metadata } from "next";
import { Provider } from "@/components/client/Provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/client/Navbar";
import Sidebar from '@/components/client/Sidebar'

export const metadata: Metadata = {
  title: "Profile",
  description: "Education CRM System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="absolute h-[90vh] right-0 ml-64 left-0 top-16">
        <Provider>{children}</Provider>
      </div>
      <Toaster />
    </div>
  );
}
