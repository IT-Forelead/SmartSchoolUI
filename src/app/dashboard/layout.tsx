import Navbar from "@/components/client/Navbar";
import { Provider } from "@/components/client/Provider";
import Sidebar from '@/components/client/Sidebar';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Automated School",
  description: "Education CRM System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen">
      <div className='relative w-64 h-screen py-2.5 bg-white border-r border-gray-200 px-7'>
        <Sidebar />
      </div>
      <div className="flex-auto overflow-auto">
        <Navbar />
        <div>
          <Provider>{children}</Provider>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
