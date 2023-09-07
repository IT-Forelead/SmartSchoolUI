"use client"

import { Button } from '@/components/ui/button'
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGroupsList } from '@/hooks/useGroups'
import { useSubjectsList } from '@/hooks/useSubjects'
import { useTeachersList } from '@/hooks/useTeachers'
import { useTargetLesson } from '@/hooks/useTimeTable'
import { SolarBoxMinimalisticBroken } from '@/icons/BoxIcon'
import { moments, translateWeekday, weekdays } from '@/lib/composables'
import { notifyError, notifySuccess } from '@/lib/notify'
import { cn } from '@/lib/utils'
import { Group, LessonBody, Subject, Teacher } from '@/models/common.interface'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function TargetLesson() {

  const teacherResponse = useTeachersList();
  const teachers = teacherResponse?.data?.data || []
  const groupResponse = useGroupsList();
  const groups = groupResponse?.data?.data || []
  const subjectResponse = useSubjectsList();
  const subjects = subjectResponse?.data?.data || []

  const [openTeacher, setOpenTeacher] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>()

  const [openGroup, setOpenGroup] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group>()

  const [openSubject, setOpenSubject] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject>()

  const [day, setDay] = useState('')
  const [moment, setMoment] = useState(0)


  function getSelectedDay(givenDay: string) {
    setDay(givenDay)
  }

  function getSelectedMoment(order: string) {
    setMoment(+order)
  }

  const { handleSubmit } = useForm<LessonBody>();
  const { mutate: targetLesson, isSuccess, error, isLoading } = useTargetLesson();

  const onSubmit: SubmitHandler<LessonBody> = (data) => {
    data.teacherId = selectedTeacher?.id || ''
    data.groupId = selectedGroup?.id || ''
    data.subjectId = selectedSubject?.id || ''
    data.weekday = day
    data.moment = moment
    if (!data.teacherId) {
      notifyError('Iltimos o`qituvchini tanlang!')
    } else if (!data.groupId) {
      notifyError('Iltimos guruhni tanlang!')
    } else if (!data.subjectId) {
      notifyError('Iltimos fanni tanlang!')
    } else if (!data.weekday) {
      notifyError('Iltimos kunni tanlang!')
    } else if (!data.moment) {
      notifyError('Iltimos dars joylashuvini tanlang!')
    } else {
      targetLesson(data)
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("So`rov yuborildi")
    } else if (error) {
      if (error?.response?.data) {
        notifyError(error?.response?.data as string || "So`rov yuborishda muammo yuzaga keldi")
      } else {
        notifyError("So`rov yuborishda muammo yuzaga keldi")
      }
    } else return;
  }, [isSuccess, error])

  return (
    <Dialog>
      <DialogTrigger>
        <Button className='bg-blue-700 hover:bg-blue-900'>
          <SolarBoxMinimalisticBroken className='w-6 h-6 mr-2' />
          Dars kunini belgilash
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dars jadvalidan o`qituvchiga mos kunni belgilash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} method='POST' content='' className='space-y-3'>
          <Popover open={openTeacher} onOpenChange={setOpenTeacher}>
            <p className="font-semibold">O`qituvchi:</p>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTeacher}
                className="justify-between w-full"
              >
                {selectedTeacher
                  ? selectedTeacher?.fullName
                  : "O`qituvchi tanlash..."}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Izlash..." />
                <CommandEmpty>O`qituvchi topilmadi.</CommandEmpty>
                <CommandGroup className="overflow-auto max-h-80">
                  {teachers?.map((teacher) => (
                    <CommandItem
                      key={teacher?.id}
                      onSelect={() => {
                        setSelectedTeacher(teacher)
                        setOpenTeacher(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTeacher?.id === teacher?.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {teacher?.fullName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover open={openGroup} onOpenChange={setOpenGroup}>
            <p className="font-semibold">Guruh:</p>
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
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Izlash..." />
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
          <Popover open={openSubject} onOpenChange={setOpenSubject}>
            <p className="font-semibold">Fan:</p>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSubject}
                className="justify-between w-full"
              >
                {selectedSubject
                  ? selectedSubject?.name
                  : "Fan tanlash..."}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Izlash..." />
                <CommandEmpty>Fan topilmadi.</CommandEmpty>
                <CommandGroup className="overflow-auto max-h-80">
                  {subjects.map((subject) => (
                    <CommandItem
                      key={subject?.id}
                      onSelect={() => {
                        setSelectedSubject(subject)
                        setOpenSubject(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSubject?.id === subject?.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {subject?.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Select onValueChange={(val) => getSelectedDay(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hafta kunlari..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="overflow-auto h-52">
                {weekdays?.map((day, idx) => {
                  return (
                    <SelectItem key={idx} value={translateWeekday(day)}>{day}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => getSelectedMoment(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Dars joylashuvi..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="overflow-auto h-52">
                {moments?.map((moment, idx) => {
                  return (
                    <SelectItem key={idx} value={`${moment}`}>{moment}-para</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-end mt-5">
            {!isLoading ?
              <Button autoFocus={true}>So`rov yuborish</Button> :
              <Button disabled className="select-none">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                So`rov yuborilmoqda...
              </Button>
            }
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
