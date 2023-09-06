import { StudyHours } from '@/app/dashboard/studyhours/page'
import { Subject } from '@/app/dashboard/subjects/page'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useChangeTeacherLessonHour } from '@/hooks/useStudyHours'
import { notifyError, notifySuccess } from '@/lib/notify'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { spawn } from 'child_process'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export type LessonHour = {
  "subjectId": string,
  "hour": number,
  "level": number
}

export default function ChangeLessonHour(props: {
  subject: Subject,
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<any, any>>
  refetchSubjects: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<any, any>>
  subjectId: string,
  studentCount: number,
  level: number,
  studyHours: StudyHours[]
}) {
  const subject = props?.subject

  const { handleSubmit, reset, register } = useForm<LessonHour>();
  const { mutate: changeTeacherLessonHour, isSuccess, error, isLoading } = useChangeTeacherLessonHour();

  const onSubmit: SubmitHandler<LessonHour> = (data) => {
    data.subjectId = props?.subjectId
    data.level = props?.level
    changeTeacherLessonHour(data)
  };

  function getHour(level: number, sId: string) {
    return props?.studyHours?.find(sh => sh.subjectId === sId && sh.level === level)?.hour
  }

  function fillColor(studentsCount: number, divide: boolean) {
    if (divide && studentsCount >= 25) {
      return 'bg-green-500 hover:bg-green-600'
    }
    return 'bg-white hover:bg-gray-100'
  }

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi")
      props.refetch()
      props.refetchSubjects()
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
    } else return;
  }, [isSuccess, error])

  return (
    <td className={`p-2 border cursor-pointer ${fillColor(props?.studentCount, subject?.needDivideStudents)}`}>
      <Dialog defaultOpen={false}>
        <DialogTrigger className='w-full text-left'>
          <div className='text-center'>{getHour(props?.level, subject.id) || <span className='opacity-0'>0</span>}</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dars soatini o`zgartirish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} method='POST' content=''>
            <p>Guruh: {props.level}-sinf</p>
            <p>Fan: {subject?.name}</p>
            <p>Soat:</p>
            <Input type="text" {...register("hour", { required: true })} placeholder='5' />
            <DialogTrigger className="flex items-center justify-end w-full mt-5">
              {!isLoading ?
                <Button autoFocus={true}>Saqlash</Button> :
                <Button disabled className="select-none">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saqlanmoqda...
                </Button>
              }
            </DialogTrigger>
          </form>
        </DialogContent>
      </Dialog>
    </td>
  )
}
