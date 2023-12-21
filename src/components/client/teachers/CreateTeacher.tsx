"use client";
import moment from "moment";
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
import {useGroupsList} from "@/hooks/useGroups";
import {notifyError, notifySuccess} from "@/lib/notify";
import {cn} from "@/lib/utils";
import {CreateTeacher, Group, Teacher} from "@/models/common.interface";
import {Check, ChevronsUpDown, Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {SolarAddCircleBroken} from "@/icons/PlusIcon";
import Image from "next/image";
import {SolarUserBroken} from "@/icons/UserIcon";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {useCreateTeacher, useTeachersList} from "@/hooks/useTeachers";
import {useSubjectsList} from "@/hooks/useSubjects";
import { log } from "console";


export default function TargetLesson() {
    const image = null;
    const subjectsResponse = useSubjectsList();
    const subjects = subjectsResponse?.data?.data;
    const [openModal, setOpenModal] = useState(false)
    const {register, handleSubmit, reset} = useForm<CreateTeacher>();
    const {refetch} = useTeachersList();
    const {mutate: createTeacher, isSuccess, error, isLoading,} = useCreateTeacher();
    const [gender, setGender] = useState<string>("");
    const onSubmit: SubmitHandler<CreateTeacher> = (data) => {
        // @ts-ignore
        data.gender = gender;
        data.citizenship = "uzbekistan";
        data.nationality = "uzbek";
        data.documentType = "passport";
        data.dateOfBirth = moment(data.dateOfBirth, 'yyyy-MM-DD').format("DD.MM.yyyy");
        data.subjectName = subjectIdsList.map(id => getSubjectNameById(id)).join('');
        if (!data.fullName) {
            notifyError("Iltimos o`qituvchini ism familiyasini kiriting!");
        } else if (!data.gender) {
            notifyError("Iltimos o`qituvchini jinsini kiriting!");
        } else {            
            createTeacher(data);
            setOpenModal(false);
            setSubjectIdsList([])
            reset()
        }
    };
    const getSubjectNameById = (id: string) => {
        const selectedSubject = subjects?.find(subject => subject.id === id);
        return selectedSubject?.name || '';
    };
    const [subjectIdsList, setSubjectIdsList] = useState<string[]>([])

    function getSelectData(order: number, sv: string) {
        if (order === 0 && subjectIdsList.length !== 2 || order === 1 && subjectIdsList.length !== 2) {
            setSubjectIdsList([...subjectIdsList, sv]);
        } else {
            subjectIdsList[order] = sv;
            setSubjectIdsList(subjectIdsList);
        }
    }

    useEffect(() => {
        if (!openModal) {
          reset(); // Reset the form fields
        }
      }, [openModal, reset]);

    useEffect(() => {
        if (isSuccess) {
            refetch()
            notifySuccess("O`qituvchi qo`shildi");
            setOpenModal(false)
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

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger>
                <Button className="bg-blue-700 hover:bg-blue-900 mx-2">
                    <SolarAddCircleBroken className="w-6 h-6 mr-2"/>
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
                                    <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5"/>
                                </div>
                            )}


                            <div className="w-full grid space-y-3 mb-3">
                                <div className="flex items-center w-full space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
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
                                <div className="flex items-center w-full space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
                                        Date of birth:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="date"
                                            className="w-full"
                                            {...register("dateOfBirth")}
                                        />
                                        
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 text-base text-gray-500 whitespace-nowrap">
                                        Fani:
                                    </div>
                                    <div className="w-full text-lg font-medium">
                                        <Select
                                            onValueChange={(val) =>
                                                getSelectData(0, val)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Fanlar..."/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="overflow-auto h-52">
                                                    {subjects?.map(
                                                        ({name, id}) => {
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
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
                                        Jinsi:
                                    </div>
                                    <div className="flex space-x-4">
                                        <label className="py-2 rounded flex items-center">
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
                                        <label className="py-2 rounded flex items-center px-12">
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
                                    <div className="w-24 text-base font-semibold text-gray-500">
                                        Document Series:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="text"
                                            className="w-full"
                                            {...register("documentSeries")}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center w-full space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
                                        Document Number:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="text"
                                            className="w-full"
                                            {...register("documentNumber")}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center w-full space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
                                        Pinfl:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input
                                            type="text"
                                            className="w-full"
                                            {...register("pinfl")}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center w-full space-x-2">
                                    <div className="w-24 text-base font-semibold text-gray-500">
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
