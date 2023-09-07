import "./globals.css";
import type { Metadata } from "next";
import { Provider } from "@/components/client/Provider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Automated School",
  description: "Education CRM System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <ToastContainer />
      </body>
    </html>
  );
}
