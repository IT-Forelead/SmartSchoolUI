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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGroupsList } from "@/hooks/useGroups";
import { notifyError, notifySuccess } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { Group, Teacher } from "@/models/common.interface";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SolarAddCircleBroken } from "@/icons/PlusIcon";
import Image from "next/image";
import { SolarUserBroken } from "@/icons/UserIcon";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useCreateTeacher } from "@/hooks/useTeachers";
import { useSubjectsList } from "@/hooks/useSubjects";

export default function TargetLesson() {
    const subjectsResponse = useSubjectsList();
    const subjects = subjectsResponse?.data?.data;

    const groupResponse = useGroupsList();
    const groups = groupResponse?.data?.data || [];
    const [openGroup, setOpenGroup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group>();
    const { register, handleSubmit, reset } = useForm<Teacher>();
    const {
        mutate: createTeacher,
        isSuccess,
        error,
        isLoading,
    } = useCreateTeacher();
    const [gender, setGender] = useState<string>("");

    const onSubmit: SubmitHandler<Teacher> = (data) => {
        // @ts-ignore
        data.gender = gender;
        data.citizenship = "uzbekistan";
        data.nationality = "uzbek";
        if (!data.fullName) {
            notifyError("Iltimos o`qituvchini ism familiyasini kiriting!");
        } else {
            createTeacher(data);
        }
    };

    const [subjectIdsList, setSubjectIdsList] = useState<string[]>([])

    function getSelectData(order: number, sv: string) {
        if (order === 0 && subjectIdsList.length !== 2 || order === 1 && subjectIdsList.length !== 2) {
          setSubjectIdsList([...subjectIdsList, sv])
        } else {
          subjectIdsList[order] = sv
          setSubjectIdsList(subjectIdsList)
        }
      }

    useEffect(() => {
        if (isSuccess) {
            notifySuccess("O`qituvchi qo`shildi");
        } else if (error) {
            if (error?.response?.data) {
                notifyError(
                    (error?.response?.data as string) ||
                        "O`qituvchi qo'shishda muammo yuzaga keldi"
                );
            } else {
                notifyError("O`qituvchi qo'shishda muammo yuzaga keldi");
            }
        } else return;
    }, [isSuccess, error]);
    const image = null;
    return (
        <Dialog>
            <DialogTrigger>
                <Button className="bg-blue-700 hover:bg-blue-900 mx-2">
                    <SolarAddCircleBroken className="w-6 h-6 mr-2" />
                    O`qituvchi qo'shish
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>O`qituvchi qo'shish</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    method="POST"
                    content=""
                >
                    <div className="w-full space-y-4 bg-white rounded">
                        <div className="flex items-start space-x-4">
                            {image ? (
                                <div>
                                    <Image
                                        src="/public/test.png"
                                        alt="teacher image"
                                        width={100}
                                        height={100}
                                        className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
                                </div>
                            )}

                            <div className="w-full grid space-y-3 mb-3">
                                <div className="flex items-center w-full space-x-2">
                                    <div className="text-base font-semibold text-gray-500">
                                        F.I.SH:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="text"
                                            placeholder="Ism, familiya, otasining ismi"
                                            className="w-full"
                                            {...register("fullName")}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-base text-gray-500 whitespace-nowrap">
                                        Birinchi fan:
                                    </div>
                                    <div className="w-full text-lg font-medium">
                                        <Select
                                            onValueChange={(val) =>
                                                getSelectData(0, val)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Fanlar..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="overflow-auto h-52">
                                                    {subjects?.map(
                                                        ({ name, id }) => {
                                                            return (
                                                                <SelectItem
                                                                    key={id}
                                                                    value={id}
                                                                >
                                                                    {name}
                                                                </SelectItem>
                                                            );
                                                        }
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex space-x-5">
                                    <p className="text-base font-semibold text-gray-500">
                                        Jinsi:
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <label className="py-2 border rounded flex items-center px-12">
                                            <input
                                                className="mr-2 w-5 h-5"
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                onChange={() =>
                                                    setGender("male")
                                                }
                                            />
                                            Erkak
                                        </label>
                                        <label className="py-2 border rounded flex items-center px-12">
                                            <input
                                                className="mr-2 w-5 h-5"
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                onChange={() =>
                                                    setGender("female")
                                                }
                                            />
                                            Ayol
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center w-full space-x-2">
                                    <div className="text-base font-semibold text-gray-500">
                                        Telefon:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="text"
                                            className="w-full"
                                            {...register("phone")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button autoFocus={true}>Saqlash</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
