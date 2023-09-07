import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useChangeTeacherLesson } from '@/hooks/useTeachers'
import { useSwitchTwoLessonOrder } from '@/hooks/useTimeTable'
import useUserInfo from '@/hooks/useUserInfo'
import { translateWeekday } from '@/lib/composables'
import { notifyError, notifySuccess } from '@/lib/notify'
import { AbsentLessonBody, LessonBody } from '@/models/common.interface'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function AbsentLesson(props: {
  subject: any,
  class: any,
  day: string,
  getAvailableLessonForSwap: (lesson: LessonBody) => void,
  setAvailableLessons: Dispatch<SetStateAction<LessonBody[]>>,
  availableLessons: LessonBody[],
  selectedSubject?: LessonBody,
  setSelectedSubject: React.Dispatch<React.SetStateAction<LessonBody | undefined>>,
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<any, any>>
}) {
  const subject = props.subject
  const user = useUserInfo()

  const { handleSubmit, reset } = useForm<AbsentLessonBody>();
  const { mutate: changeTeacherLesson, isSuccess, error, isLoading } = useChangeTeacherLesson();

  useEffect(() => {
    reset({
      subjectId: subject?.subjectId,
      groupId: subject?.groupId,
      weekday: translateWeekday(props.day),
      moment: subject?.moment
    })
  }, [props.day, reset, subject?.groupId, subject?.moment, subject?.subjectId])

  const lessonBody = {
    groupId: subject?.groupId,
    moment: subject?.moment,
    subjectId: subject?.subjectId,
    teacherId: subject?.teacherId,
    weekday: translateWeekday(props.day)
  } as LessonBody

  const onSubmit: SubmitHandler<AbsentLessonBody> = (data) => {
    if (data?.groupId) {
      changeTeacherLesson(data)
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

  function compareLessonBody(lesson: LessonBody) {
    if (props.availableLessons?.find((l) => {
      return l?.moment === lesson.moment &&
        l.groupId === lesson.groupId && l.subjectId === lesson.subjectId &&
        l.teacherId === lesson.teacherId && l.weekday === lesson.weekday
    })) {
      return 'bg-green-500 text-white'
    }
    return ''
  }

  function fillColorSelectedSubject(lesson: LessonBody) {
    if (props.selectedSubject?.moment === lesson.moment && props.selectedSubject.groupId === lesson.groupId
      && props.selectedSubject.subjectId === lesson.subjectId && props.selectedSubject.teacherId === lesson.teacherId
      && props.selectedSubject.weekday === lesson.weekday) {
      return 'bg-indigo-500 text-white'
    }
    return
  }


  const {
    mutate: switchTwoLessonOrder,
    isSuccess: isSuccessSwitchTwoLessonOrder,
    error: errorSwitchTwoLessonOrder,
    isLoading: isLoadingSwitchTwoLessonOrder
  } = useSwitchTwoLessonOrder();

  useEffect(() => {
    if (isSuccessSwitchTwoLessonOrder) {
      notifySuccess("O`zgarishlar saqlandi")
      props.setAvailableLessons([])
      props.refetch()
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
    } else return;
  }, [isSuccessSwitchTwoLessonOrder, error]);

  function doSomethingFunc(changeFunc: string) {
    props.setSelectedSubject(lessonBody)
    if (changeFunc) {
      if (window.confirm('Darslar joylashuvini o`zgartirishga rozimisiz?')) {
        switchTwoLessonOrder({
          lesson1: lessonBody,
          lesson2: props.selectedSubject
        })
      }
    } else {
      props.getAvailableLessonForSwap(lessonBody)
    }
  }


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
        </DialogTrigger> :
        <div onClick={() => doSomethingFunc(compareLessonBody(lessonBody))}
          className={`w-full text-left hover:cursor-pointer hover:bg-gray-200 ${fillColorSelectedSubject(lessonBody)} ${compareLessonBody(lessonBody)}`}>
          <li className="p-1 border" key={subject}>
            {subject?.moment}. {subject?.subjectName}
            <p className="text-[11px] text-right capitalize font-bold">
              {subject?.teacherName}
            </p>
          </li>
        </div>
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
