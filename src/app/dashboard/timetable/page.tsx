"use client";

import Loader from "@/components/client/Loader";
import AbsentLesson from "@/components/client/timetable/AbsentLesson";
import TargetLesson from "@/components/client/timetable/TargetLesson";
import TimetableChangesHistory from "@/components/client/timetable/TimetableChangesHistory";
import { Button } from "@/components/ui/button";
import {
  lessonForSwap,
  rebuildTimetable,
  useTimeTable,
} from "@/hooks/useTimeTable";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarRefreshSquareBroken } from "@/icons/Reload";
import { translateWeekday, weekdays } from "@/lib/composables";
import { notifyError } from "@/lib/notify";
import { LessonBody } from "@/models/common.interface";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function TimeTablePage() {
  const currentUser = useUserInfo();
  const timeTableResponse = useTimeTable();
  const timetable = timeTableResponse?.data?.data ?? {};
  let groups: string[] = Object.keys(timetable) ?? [];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  async function regenerate() {
    setIsGenerating(true);
    await rebuildTimetable()
      .then((res) => {
        setIsGenerating(false);
        timeTableResponse.refetch();
      })
      .catch((err) => {
        notifyError(
          "Dars jadvalini qayta shakllantirishda muammo yuzaga keldi!",
        );
        setTimeout(() => {
          setIsGenerating(false);
        }, 3000);
      });
  }

  const [availableLessons, setAvailableLessons] = useState<LessonBody[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<LessonBody>();

  function getAvailableLessonForSwap(lesson: LessonBody) {
    lessonForSwap(lesson)
      .then((res) => {
        setAvailableLessons(res.data);
      })
      .catch((err) => {
        notifyError("Dars pozitsiyalarini olishda muammo yuzaga keldi");
      });
  }

  return (
    <div className="p-2 px-5">
      {currentUser?.User?.role?.includes("admin") ? (
        <div className="flex w-full items-center justify-end">
          <div className="my-3 flex items-center justify-center space-x-5">
            <TimetableChangesHistory />
            <TargetLesson />
            {!isGenerating ? (
              <Button
                onClick={() => regenerate()}
                className="flex items-center whitespace-nowrap"
              >
                <SolarRefreshSquareBroken className="mr-2 h-6 w-6" />
                Qayta generatsiya qilish
              </Button>
            ) : (
              <Button disabled className="select-none">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Qayta generatsiya qilinmoqda...
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {!timeTableResponse.isLoading ? (
        <table className="w-full border text-sm dark:border-slate-600">
          <thead>
            <tr className="border bg-gray-100 text-gray-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
              <th className="border bg-gray-500 p-2 text-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                Dars jadvali
              </th>
              {weekdays.map((day) => {
                return (
                  <th key={day} className="border p-2 dark:border-slate-600">
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groups
              ?.sort((a, b) => {
                const [aNumber, aLetter] = a.split("-");
                const [bNumber, bLetter] = b.split("-");

                if (aNumber !== bNumber) {
                  return parseInt(aNumber) - parseInt(bNumber);
                } else {
                  if (aLetter < bLetter) return -1;
                  if (aLetter > bLetter) return 1;
                  return 0;
                }
              })
              ?.map((item, idx) => {
                return (
                  <tr
                    key={item}
                    className={`border dark:border-slate-600 ${
                      idx % 2 !== 1
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-100 dark:bg-slate-700/70"
                    }`}
                  >
                    <td className="border p-1 text-center font-medium text-gray-500 dark:border-slate-600 dark:text-slate-400">
                      {item}
                    </td>
                    {weekdays.map((day) => {
                      return (
                        <td
                          key={day}
                          className="border p-1 align-top font-medium text-gray-500 dark:border-slate-600"
                        >
                          <ol className="space-y-1 dark:text-slate-300/80">
                            {timetable[item][translateWeekday(day)]?.map(
                              (subject: any, idx: any) => {
                                return (
                                  <AbsentLesson
                                    key={idx}
                                    subject={subject}
                                    class={item}
                                    day={day}
                                    getAvailableLessonForSwap={
                                      getAvailableLessonForSwap
                                    }
                                    setAvailableLessons={setAvailableLessons}
                                    availableLessons={availableLessons}
                                    setSelectedSubject={setSelectedSubject}
                                    selectedSubject={selectedSubject}
                                    refetch={timeTableResponse.refetch}
                                  />
                                );
                              },
                            )}
                          </ol>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <Loader />
      )}
    </div>
  );
}
