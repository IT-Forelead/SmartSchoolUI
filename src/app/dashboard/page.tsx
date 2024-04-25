"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useUserInfo from "@/hooks/useUserInfo";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherStatistics from "@/components/client/main/TeacherStatistics";
import StudentStatistics from "@/components/client/main/StudentStatistics";

export default function Home() {
  const SmsMessagesChart = dynamic(
    () => import("@/components/client/main/SmsMessagesChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="col-span-2 rounded-lg" />,
    },
  );
  const TelegramMessagesChart = dynamic(
    () => import("@/components/client/main/TelegramMessagesChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="col-span-2 rounded-lg" />,
    },
  );
  const TeacherVisitsChart = dynamic(
    () => import("@/components/client/main/TeacherVisitsChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="col-span-4 h-80 rounded-lg" />,
    },
  );
  const StudentVisitsChart = dynamic(
    () => import("@/components/client/main/StudentVisitsChart"),
    {
      ssr: false,
      loading: () => <Skeleton className="col-span-4 h-80 rounded-lg" />,
    },
  );

  const currentUser = useUserInfo();
  const router = useRouter();
  useEffect(() => {
    if (currentUser?.User?.role?.includes("visit_monitoring")) {
      router.push("/monitoring");
    }
  }, [currentUser?.User?.role, router]);
  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid grid-cols-8 gap-4">
          <TeacherStatistics />
          <StudentStatistics />
          <SmsMessagesChart />
          <TelegramMessagesChart />
          <TeacherVisitsChart />
          <StudentVisitsChart />
        </div>
      </div>
    </div>
  );
}
