"use client"
import Loader from '@/components/client/Loader';
import { Button } from '@/components/ui/button';
import { useTimeTable } from '@/hooks/useTimeTable';
import { SolarDownloadSquareBroken } from '@/icons/DownloadIcon';

export default function TimeTablePage() {
  const timeTableResponse = useTimeTable();
  const timetable = timeTableResponse?.data?.data ?? {}
  const groups: string[] = Object.keys(timetable) ?? []
  const weekdays = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba"
  ];

  const weekdaysThreeLetter = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ]

  function translateWeekday(uwd: string) {
    const weekdayMap = new Map();

    for (let i = 0; i < weekdays.length; i++) {
      weekdayMap.set(weekdays[i], weekdaysThreeLetter[i]);
    }
    return weekdayMap.get(uwd)
  }

  return (
    <div className='p-2 px-5'>
      {!false ?
        <table className='w-full text-sm border'>
          <thead>
            <tr className='text-gray-500 border'>
              <th className="p-2 text-white bg-gray-400 border">Dars jadvali</th>
              {weekdays.map(day => {
                return (
                  <th key={day} className="p-2 border">{day}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {
              groups?.sort()?.map((item) => {
                return (
                  <tr key={item} className='border'>
                    <td className="p-1 font-medium text-center text-gray-500 border">{item}</td>
                    {weekdays.map(day => {
                      return (
                        <td key={day} className="p-1 font-medium text-gray-500 border">
                          <ol className='divide-y'>
                            {timetable[item][translateWeekday(day)]?.map((subject: any) => {
                              return <li className='p-2' key={subject}>{subject?.moment}. {subject?.subjectName}</li>
                            })
                            }
                          </ol>
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            }
          </tbody>
        </table> :
        <Loader />
      }
    </div>
  )
}
