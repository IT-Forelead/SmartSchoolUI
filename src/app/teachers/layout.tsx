import "../globals.css";
import type { Metadata } from "next";
import { Provider } from "@/components/client/Provider";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import Navbar from "@/components/client/Navbar";
import Sidebar from '@/components/client/Sidebar'
const inter = Inter({ subsets: ["latin"] });

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
    <div>
      <Navbar />
      <Sidebar />
      <div className="absolute h-[90vh] right-0 ml-64 left-0 top-16">
        <Provider>{children}</Provider>
      </div>
      <ToastContainer />
    </div>
  );
}
