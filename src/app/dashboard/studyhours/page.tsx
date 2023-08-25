"use client"
import Loader from '@/components/client/Loader';
import { Button } from '@/components/ui/button';
import { useGroupsList } from '@/hooks/useGroups';
import { useStudyHoursList } from '@/hooks/useStudyHours';
import { useSubjectsList } from '@/hooks/useSubjects';
import { SolarDownloadSquareBroken } from '@/icons/DownloadIcon';
import xlsx from "json-as-xlsx";

export type StudyHours = {
  "level": number,
  "hour": number,
  "subjectId": string
}

const settings = {
  fileName: "Dars soatlari", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
}

export default function StudyHoursPage() {
  const subjectResponse = useSubjectsList();
  const groupResponse = useGroupsList();
  const studyHoursResponse = useStudyHoursList();
  const subjects = subjectResponse?.data?.data ?? []
  const groups = groupResponse?.data?.data ?? []
  const studyHours = studyHoursResponse?.data?.data ?? []

  function getHour(level: number, sId: string) {
    return studyHours.find(sh => sh.subjectId === sId && sh.level === level)?.hour
  }

  function fillColor(studentsCount: number, divide: boolean) {
    if (divide && studentsCount >= 25) {
      return 'bg-green-500'
    }
    return 'bg-white'
  }

  function downloadExcel() {
    let data = [
      {
        sheet: "Dars soatlari",
        columns: [
          { label: "Fanlar", value: "subjectName" },
          ...groups?.sort((a, b) => a.level - b.level)?.map(group => {
            return { label: `${group.level}${group.name}`, value: group.id }
          }),
          { label: "Jami (boshlang`ich)", value: "hourForBeginner" },
          { label: "Jami (yuqori)", value: "hourForHigher" },
          { label: "Qoldiq", value: "mod" },
          { label: "Jami", value: "total" },
        ],
        content: subjects?.map(item => {
          let groupList: any = {}
          groupList["subjectName"] = item.name
          groups?.sort((a, b) => a.level - b.level)?.map(group => {
            return groupList[group.id] = getHour(group.level, item.id)
          }),
            groupList["hourForBeginner"] = item.hourForBeginner
          groupList["hourForHigher"] = item.hourForHigher
          groupList["mod"] = 0
          groupList["total"] = item.hourForBeginner + item.hourForHigher
          return groupList
        })
      }
    ]

    xlsx(data, settings)
  }

  return (
    <div className='p-2 px-5'>
      <div className='flex items-center justify-end w-full'>
        <Button onClick={() => downloadExcel()} className='flex items-center mt-2 mb-3'>
          <SolarDownloadSquareBroken className='w-6 h-6 mr-2' />
          Excel formatda yuklash
        </Button>
      </div>
      {!subjectResponse.isLoading ?
        <table className='w-full text-sm border'>
          <thead>
            <tr className='text-gray-500 border'>
              <th className="p-2 border">Fanlar</th>
              {groups?.sort((a, b) => a.level - b.level)?.map((group, idx) => {
                return (
                  <th key={idx} className="p-2 font-medium border whitespace-nowrap">{`${group.level}${group.name}`}</th>
                )
              })}
              <th className="p-2 text-center border">Jami <br /> (boshlang`ich)</th>
              <th className="p-2 text-center border">Jami <br /> (yuqori)</th>
              <th className="p-2 text-center border">Qoldiq</th>
              <th className="p-2 text-center border">Jami</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.map((item, idx) => {
              return (
                <tr key={idx} className='border'>
                  <td className="p-1 font-medium text-gray-500 border whitespace-nowrap">{item.name}</td>
                  {groups?.map(({ level, id, studentCount }) => {
                    return (
                      <td className={`p-2 text-center border ${fillColor(studentCount, item.needDivideStudents)}`} key={id}>{getHour(level, item.id)}</td>
                    )
                  })}
                  <td className="p-1 font-medium text-center border">{item.hourForBeginner}</td>
                  <td className="p-1 font-medium text-center border">{item.hourForHigher}</td>
                  <td className="p-1 font-medium text-center border"></td>
                  <td className="p-1 font-medium text-center border">{item.hourForHigher + item.hourForBeginner}</td>
                </tr>
              )
            })}
          </tbody>
        </table> :
        <Loader />
      }
    </div>
  )
}
