"use client";
import Loader from "@/components/client/Loader";
import { Button } from "@/components/ui/button";
import { useTimeTable, rebuildTimetable } from "@/hooks/useTimeTable";
import { SolarRefreshSquareBroken } from "@/icons/Reload";
import React from "react";

export default function TimeTablePage() {
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

  return (
    <div className="p-2 px-5">
      <div className="flex items-center justify-end w-full">
        <Button
          onClick={() => regenerate()}
          className="flex items-center mt-2 mb-3"
        >
          <SolarRefreshSquareBroken className="w-6 h-6 mr-2" />
          Qayta generatsiya qilish
        </Button>
      </div>
      {!false ? (
        <table className="w-full text-sm border">
          <thead>
            <tr className="text-gray-500 border bg-gray-100">
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
                    className={`border ${
                      idx % 2 !== 1 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <td className="p-1 font-medium text-center text-gray-500 border">
                      {item}
                    </td>
                    {weekdays.map((day) => {
                      return (
                        <td
                          key={day}
                          className="p-1 align-top font-medium text-gray-500 border"
                        >
                          <ol className="space-y-1">
                            {timetable[item][translateWeekday(day)]?.map(
                              (subject: any) => {
                                return (
                                  <li className="p-1 border" key={subject}>
                                    {subject?.moment}. {subject?.subjectName}
                                    <p className="text-[11px] text-right capitalize font-bold">
                                      {subject?.teacherName}
                                    </p>
                                  </li>
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
