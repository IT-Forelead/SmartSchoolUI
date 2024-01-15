"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useChangeTeacherWorkload,
  useTeachersList,
  useWorkloadHistoryList,
} from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarClockSquareBroken } from "@/icons/TeacherHourIcon";
import { notifyError, notifySuccess, notifyWarn } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Teacher, TeacherWorkloadChange } from "@/models/common.interface";

export function ChangeWorkload() {
  const [open, setOpen] = useState(false);
  const [img, setImage] = useState("");

  const { handleSubmit, setValue, register } = useForm<TeacherWorkloadChange>();
  const {
    mutate: changeTeacherWorkload,
    isSuccess,
    error,
    isLoading,
  } = useChangeTeacherWorkload();

  const onSubmit: SubmitHandler<TeacherWorkloadChange> = (data) =>
    changeTeacherWorkload(data);

  const workloadHistoryResponse = useWorkloadHistoryList();

  const user = useUserInfo();

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      workloadHistoryResponse.refetch();
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
    } else return;
  }, [isSuccess, error]);

  function catchFile(e: any) {
    if (e.target.files[0].type.includes("image")) {
      setValue("filename", e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    } else {
      notifyWarn("Boshqa formatdagi file kiritdingiz!");
    }
  }

  const [openToTeacher, setOpenToTeacher] = useState(false);
  const [fromTeacher, setFromTeacher] = useState<Teacher>();
  const [toTeacher, setToTeacher] = useState<Teacher>();

  useEffect(() => {
    if (fromTeacher?.workload === 0) {
      notifyError("O`qituvchida dars soati 0 ga teng!");
    } else {
      setValue("from", fromTeacher?.id || "");
    }
  }, [fromTeacher, setValue]);

  useEffect(() => {
    setValue("to", toTeacher?.id || "");
    setValue("userId", user?.User?.id || "");
  }, [toTeacher, setValue, user]);

  const teacherResponse = useTeachersList();
  const teachers = teacherResponse?.data?.data || [];

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mb-3 mt-2 flex items-center">
          <SolarClockSquareBroken className="mr-2 h-6 w-6" />
          O`qituvchi dars soatini o`zgartirish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dars soatini boshqarish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} method="POST" content="">
          <Popover open={open} onOpenChange={setOpen}>
            <p className="font-semibold">Kimdan:</p>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {fromTeacher
                  ? fromTeacher?.fullName + " | " + fromTeacher?.workload
                  : "O`qituvchi tanlash..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Izlash..." />
                <CommandEmpty>O`qituvchi topilmadi.</CommandEmpty>
                <CommandGroup className="max-h-80 overflow-auto">
                  {teachers?.map((teacher) => (
                    <CommandItem
                      key={teacher?.id}
                      onSelect={() => {
                        setFromTeacher(teacher);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          fromTeacher?.id === teacher?.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {teacher?.fullName} | {teacher?.workload}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover open={openToTeacher} onOpenChange={setOpenToTeacher}>
            <p className="font-semibold">Kimga:</p>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {toTeacher
                  ? toTeacher?.fullName + " | " + toTeacher?.workload
                  : "O`qituvchi tanlash..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Izlash..." />
                <CommandEmpty>O`qituvchi topilmadi.</CommandEmpty>
                <CommandGroup className="max-h-80 overflow-auto">
                  {teachers.map((teacher) => (
                    <CommandItem
                      key={teacher?.id}
                      onSelect={() => {
                        setToTeacher(teacher);
                        setOpenToTeacher(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          toTeacher?.id === teacher?.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {teacher?.fullName} | {teacher?.workload}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div>
            <p className="font-semibold">Dars soati:</p>
            <Input
              type="number"
              placeholder="5"
              {...register("workload", { required: true })}
            />
          </div>
          <div>
            <p className="font-semibold">Asos hujjat</p>
            <Input type="file" onChange={(event) => catchFile(event)} />
          </div>
          <div className="mt-5 flex items-center justify-end">
            {!isLoading ? (
              <Button autoFocus={true}>Saqlash</Button>
            ) : (
              <Button disabled className="select-none">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
