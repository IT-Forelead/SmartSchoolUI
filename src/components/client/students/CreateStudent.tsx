"use client"

import {Button} from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useGroupsList} from '@/hooks/useGroups'
import {notifyError, notifySuccess} from '@/lib/notify'
import {cn} from '@/lib/utils'
import {Group, Student,} from '@/models/common.interface'
import {Check, ChevronsUpDown} from 'lucide-react'
import {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {SolarAddCircleBroken} from "@/icons/PlusIcon";
import Image from "next/image";
import {SolarUserBroken} from "@/icons/UserIcon";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {useCreateStudent, useStudentsList} from "@/hooks/useStudents";

export default function CreateStudent() {
    const image = null
    const groupResponse = useGroupsList();
    const groups = groupResponse?.data?.data || []
    const [openGroup, setOpenGroup] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<Group>()
    const {register, handleSubmit, reset} = useForm<Student>();
    const {mutate: createStudent, isSuccess, error, isLoading} = useCreateStudent();
    const [gender, setGender] = useState<string>('');
    const {refetch} = useStudentsList();
    const onSubmit: SubmitHandler<Student> = async (data) => {
        // @ts-ignore
        data.groupId = selectedGroup?.id || '';
        // @ts-ignore
        data.gender = gender;
        data.citizenship = "uzbekistan";
        data.nationality = "uzbek"
        if (!data.fullName) {
            notifyError('Iltimos o`quvchini ism familiyasini kiriting!')
        } else if (!data.groupId) {
            notifyError('Iltimos guruhni tanlang!')
        } else {
            createStudent(data);
            reset();
            setOpenModal(false);
        }
    };

    useEffect(() => {
        refetch()
        if (isSuccess) {
            notifySuccess("O`quvchi qo`shildi")
        } else if (error) {
            if (error?.response?.data) {
                notifyError(error?.response?.data as string || "O`quvchi qo'shishda muammo yuzaga keldi")
            } else {
                notifyError("O`quvchi qo'shishda muammo yuzaga keldi")
            }
        } else return;
    }, [isSuccess, error])
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger>
                <Button className="bg-blue-700 hover:bg-blue-900 mx-2">
                    <SolarAddCircleBroken className='w-6 h-6 mr-2'/>
                    O`quvchi qo'shish
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>O`quvchi qo'shish</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} method='POST' content=''>
                    <div className="w-full space-y-4 bg-white rounded">
                        <div className="flex items-start space-x-4">
                            {
                                image ?
                                    <div>
                                        <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                                               className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"/>
                                    </div> :
                                    <div>
                                        <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5"/>
                                    </div>
                            }

                            <div className="w-full grid space-y-3 mb-3">
                                <div className="flex items-center w-full space-x-2">
                                    <div className="text-base font-semibold text-gray-500">
                                        F.I.SH:
                                    </div>
                                    <div className="w-full text-lg font-medium capitalize">
                                        <Input type="text" placeholder="Ism, familiya, otasining ismi" className="w-full" {...register("fullName")}/>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <Popover open={openGroup} onOpenChange={setOpenGroup}>
                                        <p className="text-base font-semibold text-gray-500">Guruh:</p>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openGroup}
                                                className="justify-between w-full"
                                            >
                                                {selectedGroup
                                                    ? `${selectedGroup?.level}-${selectedGroup?.name}`
                                                    : "Guruh tanlash..."}
                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Izlash..."/>
                                                <CommandEmpty>Guruh topilmadi.</CommandEmpty>
                                                <CommandGroup className="overflow-auto max-h-80">
                                                    {groups?.sort((a, b) => a.level - b.level)?.map((group) => (
                                                        <CommandItem
                                                            key={group?.id}
                                                            onSelect={() => {
                                                                setSelectedGroup(group)
                                                                setOpenGroup(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedGroup?.id === group?.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {`${group?.level}-${group?.name}`}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex space-x-5">
                                    <p className="text-base font-semibold text-gray-500">Jins:</p>
                                    <div className="flex items-center space-x-4">
                                        <label className="py-2 border rounded flex items-center px-12">
                                            <input
                                                className="mr-2 w-5 h-5"
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                onChange={() => setGender("male")}
                                            />
                                            Erkak
                                        </label>
                                        <label className="py-2 border rounded flex items-center px-12">
                                            <input
                                                className="mr-2 w-5 h-5"
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                onChange={() => setGender("female")}
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
                                        <Input type="text" className="w-full" {...register("parentPhone")} />
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
    )
}
