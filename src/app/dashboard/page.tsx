"use client"

import TeacherStatistics from "@/components/client/main/TeacherStatistics";
import StudentStatistics from "@/components/client/main/StudentStatistics";
import SmsMessagesChart from "@/components/client/main/SmsMessagesChart";
import TeacherVisitsChart from "@/components/client/main/TeacherVisitsChart";
import StudentVisitsChart from "@/components/client/main/StudentVisitsChart";

export default function Home() {
  return (
      <>
          <div className="flex-col hidden md:flex">
              <div className="flex-1 p-8 pt-6 space-y-4">
                  <div className="grid gap-4 grid-cols-6">
                      <TeacherStatistics/>
                      <StudentStatistics/>
                      <SmsMessagesChart/>
                      <TeacherVisitsChart/>
                      <StudentVisitsChart/>
                  </div>
              </div>
          </div>
      </>
  )
}
