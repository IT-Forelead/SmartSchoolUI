"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGroupsList } from "@/hooks/useGroups";
import { useSubjectsList } from "@/hooks/useSubjects";
import { useTeachersList } from "@/hooks/useTeachers";
import { useLessonTimes, useTargetLesson } from "@/hooks/useTimeTable";
import { SolarBoxMinimalisticBroken } from "@/icons/BoxIcon";
import {
  moments,
  translateGroup,
  weekdays,
  weekdaysThreeLetter,
} from "@/lib/composables";
import { notifyError, notifySuccess } from "@/lib/notify";
import { cn } from "@/lib/utils";
import {
  Group,
  LessonCreate,
  LessonFilter,
  Subject,
  Teacher,
} from "@/models/common.interface";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useStudyHoursList } from "@/hooks/useStudyHours";

const FormSchema = z.object({
  teacherId: z.string().uuid(),
  subjectId: z.string().uuid(),
  groupId: z.string().uuid(),
  times: z.array(z.string()).min(1),
});

export default function TargetLesson() {
  const teacherResponse = useTeachersList();
  const teachers = teacherResponse?.data?.data || [];
  const groupResponse = useGroupsList();
  const groups = groupResponse?.data?.data || [];
  const studyHoursResponse = useStudyHoursList();
  const studyHours = studyHoursResponse.data?.data || [];

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [selectedSubjectHours, setSelectedSubjectHours] = useState<number>(0);

  const [lessonFilter, setLessonFilter] = useState<LessonFilter>({});
  const { data } = useLessonTimes(lessonFilter);
  const lessonTimes = data ?? [];

  const { mutate: targetLesson, isSuccess, error } = useTargetLesson();

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("So'rov yuborildi");
    } else if (error) {
      if (error?.response?.data) {
        notifyError(
          (error?.response?.data as string) ||
            "So'rov yuborishda muammo yuzaga keldi",
        );
      } else {
        notifyError("So'rov yuborishda muammo yuzaga keldi");
      }
    } else return;
  }, [isSuccess, error]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teacherId: "",
      subjectId: "",
      groupId: "",
      times: [],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const times = data.times.map((time) => {
      const [weekday, moment] = time.split("-");
      return {
        moment: parseInt(moment),
        weekday: weekday,
      };
    });
    const newData: LessonCreate = {
      teacherId: data.teacherId,
      groupId: data.groupId,
      subjectId: data.subjectId,
      times: times,
    };
    targetLesson(newData);
  };

  useEffect(() => {
    form.setValue("teacherId", selectedTeacher?.id ?? "");
    form.setValue("times", []);
    setSelectedSubject(undefined);
    setLessonFilter({ ...lessonFilter, teacherId: selectedTeacher?.id });
  }, [selectedTeacher]);

  useEffect(() => {
    form.setValue("groupId", selectedGroup?.id ?? "");
    form.setValue("times", []);
    setLessonFilter({ ...lessonFilter, groupId: selectedGroup?.id });
  }, [selectedGroup]);

  useEffect(() => {
    form.setValue("subjectId", selectedSubject?.id ?? "");
    form.setValue("times", []);
    setSelectedSubjectHours(
      studyHours.find(
        (s) =>
          s.level == selectedGroup?.level && s.subjectId == selectedSubject?.id,
      )?.hour ?? 0,
    );
  }, [selectedSubject]);

  return (
    <Dialog
      onOpenChange={(open) => {
        form.reset();
        setLessonFilter({});
      }}
    >
      <DialogTrigger>
        <Button className="bg-blue-700 hover:bg-blue-900">
          <SolarBoxMinimalisticBroken className="mr-2 h-6 w-6" />
          Dars kunini belgilash
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>
            Dars jadvalidan o&apos;qituvchiga mos kunni belgilash
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>O&apos;qituvchi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? selectedTeacher?.fullName
                            : "O'qituvchi tanlash"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="O'qituvchi tanlash..."
                          className=""
                        />
                        <CommandEmpty>O&apos;qituvchi topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {teachers.map((teacher) => (
                            <CommandItem
                              value={teacher.fullName}
                              key={teacher.id}
                              onSelect={() => setSelectedTeacher(teacher)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  teacher.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {teacher.fullName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Guruh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? translateGroup(selectedGroup)
                            : "Guruh tanlash"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Guruh tanlash..."
                          className=""
                        />
                        <CommandEmpty>Guruh topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {groups.map((group) => (
                            <CommandItem
                              value={translateGroup(group)}
                              key={group.id}
                              onSelect={() => setSelectedGroup(group)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  group.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {translateGroup(group)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fan</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={!selectedTeacher}
                        >
                          {field.value ? selectedSubject?.name : "Fan tanlash"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Fan tanlash..." />
                        <CommandEmpty>Fan topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {selectedTeacher?.subjects.map((subject) => (
                            <CommandItem
                              value={subject.name}
                              key={subject.id}
                              onSelect={() => setSelectedSubject(subject)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subject.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {subject.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="times"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">
                    Dars soatlari - {selectedSubjectHours}
                  </FormLabel>
                  <table className="w-fit table-auto border dark:border-slate-600 dark:text-slate-400">
                    <thead>
                      <tr>
                        <td></td>
                        {weekdays.map((w) => (
                          <th
                            className="border p-2 dark:border-slate-600"
                            key={w}
                          >
                            {w}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {moments.map((m) => (
                        <tr key={m}>
                          <th className="border px-2 dark:border-slate-600">
                            {m}-para
                          </th>
                          {weekdaysThreeLetter.map((w) => {
                            const item = w + "-" + m;
                            return (
                              <td
                                className="border dark:border-slate-600"
                                key={w}
                              >
                                <FormField
                                  key={item}
                                  control={form.control}
                                  name="times"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item}
                                        className="h-10 space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            id={item}
                                            className="peer"
                                            hidden={true}
                                            disabled={lessonTimes.includes(
                                              item,
                                            )}
                                            checked={field.value?.includes(
                                              item,
                                            )}
                                            aria-readonly={
                                              !field.value?.includes(item) &&
                                              !lessonTimes.includes(item) &&
                                              form.getValues().times.length >=
                                                selectedSubjectHours
                                            }
                                            onChange={(event) => {
                                              return event.target.checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item,
                                                    ),
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <label
                                          htmlFor={item}
                                          className="block h-10 cursor-pointer border-0 py-4 hover:bg-gray-50 hover:text-gray-600 peer-checked:bg-[#7cc4f7] peer-checked:text-gray-600 peer-checked:hover:bg-sky-500 peer-disabled:bg-[#fc888a] peer-disabled:hover:bg-red-400 peer-aria-readonly:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                                        ></label>
                                      </FormItem>
                                    );
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-green-600">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
