"use client";
import Loader from "@/components/client/Loader";
import ChangeLessonHour from "@/components/client/studyhours/ChangeLessonHour";
import { Button } from "@/components/ui/button";
import { useGroupsList } from "@/hooks/useGroups";
import { useStudyHoursList } from "@/hooks/useStudyHours";
import { useSubjectsList } from "@/hooks/useSubjects";
import { SolarDownloadSquareBroken } from "@/icons/DownloadIcon";
import xlsx from "json-as-xlsx";

const settings = {
  fileName: "Dars soatlari", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
};

export default function StudyHoursPage() {
  const subjectResponse = useSubjectsList();
  const groupResponse = useGroupsList();
  const studyHoursResponse = useStudyHoursList();
  const subjects = subjectResponse?.data?.data ?? [];
  const groups = groupResponse?.data?.data ?? [];
  const studyHours = studyHoursResponse?.data?.data ?? [];

  function getHour(level: number, sId: string) {
    return studyHours.find((sh) => sh.subjectId === sId && sh.level === level)
      ?.hour;
  }

  function downloadExcel() {
    let data = [
      {
        sheet: "Dars soatlari",
        columns: [
          { label: "Fanlar", value: "subjectName" },
          ...groups
            ?.sort((a, b) => a.level - b.level)
            ?.map((group) => {
              return { label: `${group.level}${group.name}`, value: group.id };
            }),
          { label: "Jami (boshlang`ich)", value: "hourForBeginner" },
          { label: "Jami (yuqori)", value: "hourForHigher" },
          { label: "Qoldiq", value: "mod" },
          { label: "Jami", value: "total" },
        ],
        content: subjects?.map((item) => {
          let groupList: any = {};
          groupList["subjectName"] = item.name;
          groups
            ?.sort((a, b) => a.level - b.level)
            ?.map((group) => {
              return (groupList[group.id] = getHour(group.level, item.id));
            }),
            (groupList["hourForBeginner"] = item.hourForBeginner);
          groupList["hourForHigher"] = item.hourForHigher;
          groupList["mod"] = 0;
          groupList["total"] = item.hourForBeginner + item.hourForHigher;
          return groupList;
        }),
      },
    ];

    xlsx(data, settings);
  }

  return (
    <div className="p-2 px-5">
      <div className="flex w-full items-center justify-end">
        <Button
          onClick={() => downloadExcel()}
          className="mb-3 mt-2 flex items-center"
        >
          <SolarDownloadSquareBroken className="mr-2 h-6 w-6" />
          Excel formatda yuklash
        </Button>
      </div>
      {!subjectResponse.isLoading ? (
        <table className="w-full border text-sm">
          <thead>
            <tr className="border text-gray-500">
              <th className="border p-2">Fanlar</th>
              {groups
                ?.sort((a, b) => a.level - b.level)
                ?.map((group, idx) => {
                  return (
                    <th
                      key={idx}
                      className="whitespace-nowrap border p-2 font-medium"
                    >{`${group.level}${group.name}`}</th>
                  );
                })}
              <th className="border p-2 text-center">
                Jami <br /> (boshlang`ich)
              </th>
              <th className="border p-2 text-center">
                Jami <br /> (yuqori)
              </th>
              <th className="border p-2 text-center">Jami</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.map((item, idx) => {
              return (
                <tr key={idx} className="border">
                  <td className="whitespace-nowrap border p-1 font-medium text-gray-500">
                    {item.name}
                  </td>
                  {groups?.map(({ level, id, studentCount }) => {
                    return (
                      <ChangeLessonHour
                        refetch={studyHoursResponse.refetch}
                        refetchSubjects={subjectResponse?.refetch}
                        subject={item}
                        level={level}
                        studentCount={studentCount}
                        studyHours={studyHours}
                        subjectId={item?.id}
                        key={id}
                      />
                    );
                  })}
                  <td className="border p-1 text-center font-medium">
                    {item.hourForBeginner}
                  </td>
                  <td className="border p-1 text-center font-medium">
                    {item.hourForHigher}
                  </td>
                  <td className="border p-1 text-center font-medium">
                    {item.hourForHigher + item.hourForBeginner}
                  </td>
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
