"use client";

import Loader from "@/components/client/Loader";
import AbsentLesson, { LessonBody } from "@/components/client/timetable/AbsentLesson";
import TargetLesson from "@/components/client/timetable/TargetLesson";
import { Button } from "@/components/ui/button";
import { useTimeTable, rebuildTimetable, lessonForSwap } from "@/hooks/useTimeTable";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarRefreshSquareBroken } from "@/icons/Reload";
import { notifyError, notifySuccess } from "@/lib/notify";
import React, { useState } from "react";

export default function TimeTablePage() {
  const currentUser = useUserInfo()
  const timeTableResponse = useTimeTable();
  const timetable = timeTableResponse?.data?.data ?? {};
  let groups: string[] = Object.keys(timetable) ?? [];
  const weekdays = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  const weekdaysThreeLetter = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function translateWeekday(uwd: string) {
    const weekdayMap = new Map();

    for (let i = 0; i < weekdays.length; i++) {
      weekdayMap.set(weekdays[i], weekdaysThreeLetter[i]);
    }
    return weekdayMap.get(uwd);
  }

  async function regenerate() {
    await rebuildTimetable().then(() => {
      timeTableResponse.refetch();
    });
  }

  const [availableLessons, setAvailableLessons] = useState<LessonBody[]>([])
  const [selectedSubject, setSelectedSubject] = useState<LessonBody>()

  function getAvailableLessonForSwap(lesson: LessonBody) {
    lessonForSwap(lesson).then((res) => {
      setAvailableLessons(res.data)
    }).catch((err) => {
      notifyError('Dars pozitsiyalarini olishda muammo yuzaga keldi')
    })
  }

  return (
    <div className="p-2 px-5">
      {currentUser?.role?.includes('admin') ?
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center justify-center my-3 space-x-5">
            <TargetLesson />
            <Button
              onClick={() => regenerate()}
              className="flex items-center whitespace-nowrap"
            >
              <SolarRefreshSquareBroken className="w-6 h-6 mr-2" />
              Qayta generatsiya qilish
            </Button>
          </div>
        </div> : <div></div>
      }

      {!timeTableResponse.isLoading ? (
        <table className="w-full text-sm border">
          <thead>
            <tr className="text-gray-500 bg-gray-100 border">
              <th className="p-2 text-white bg-gray-500 border">
                Dars jadvali
              </th>
              {weekdays.map((day) => {
                return (
                  <th key={day} className="p-2 border">
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
                    className={`border ${idx % 2 !== 1 ? "bg-white" : "bg-gray-100"}`}>
                    <td className="p-1 font-medium text-center text-gray-500 border">
                      {item}
                    </td>
                    {weekdays.map((day) => {
                      return (
                        <td
                          key={day}
                          className="p-1 font-medium text-gray-500 align-top border"
                        >
                          <ol className="space-y-1">
                            {timetable[item][translateWeekday(day)]?.map(
                              (subject: any, idx: any) => {
                                return (
                                  <AbsentLesson key={idx} subject={subject} class={item} day={day} 
                                  getAvailableLessonForSwap={getAvailableLessonForSwap} 
                                  availableLessons={availableLessons}
                                  setSelectedSubject={setSelectedSubject}
                                  selectedSubject={selectedSubject}
                                  />
                                );
                              }
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
