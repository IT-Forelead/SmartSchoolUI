import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useChangeTeacherLesson } from '@/hooks/useTeachers'
import useUserInfo from '@/hooks/useUserInfo'
import { notifyError, notifySuccess, notifyWarn } from '@/lib/notify'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export type AbsentLessonBody = {
  "subjectId": string,
  "groupId": string,
  "weekday": string,
  "moment": number
}

export default function AbsentLesson(props: { subject: any, class: any, day: string }) {
  const subject = props.subject
  const user = useUserInfo()
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

  const { handleSubmit, reset } = useForm<AbsentLessonBody>();
  const { mutate: changeTeacherLesson, isSuccess, error, isLoading } = useChangeTeacherLesson();

  useEffect(() => {
    reset({
      subjectId: subject?.subjectId,
      groupId: subject?.groupId,
      weekday: translateWeekday(props.day),
      moment: subject?.moment
    })
  }, [reset])

  const onSubmit: SubmitHandler<AbsentLessonBody> = (data) => {
    if (data?.groupId) {
      changeTeacherLesson(data)
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("So`rov yuborildi")
    } else if (error) {
      if(error?.response?.data) {
        notifyError(error?.response?.data || "So`rov yuborishda muammo yuzaga keldi")
      } else {
        notifyError("So`rov yuborishda muammo yuzaga keldi")
      }
    } else return;
  }, [isSuccess, error])

  return (
    <Dialog>
      {user?.id === subject?.teacherId ?
        <DialogTrigger className='w-full text-left'>
          <li className="p-1 text-white bg-green-500 border hover:cursor-pointer hover:bg-green-600" key={subject}>
            {subject?.moment}. {subject?.subjectName}
            <p className="text-[11px] text-right capitalize font-bold">
              {subject?.teacherName}
            </p>
          </li>
        </DialogTrigger> : <li className="p-1 border" key={subject}>
          {subject?.moment}. {subject?.subjectName}
          <p className="text-[11px] text-right capitalize font-bold">
            {subject?.teacherName}
          </p>
        </li>
      }
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Darsni boshqa o`qituvchiga berish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} method='POST' content=''>
          <p>Fan: {subject?.subjectName}</p>
          <p>Guruh: {props.class}</p>
          <p>Kun: {props.day}</p>
          <p>Dars: {subject?.moment}-dars</p>
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
