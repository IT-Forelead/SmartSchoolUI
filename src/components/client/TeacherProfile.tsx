import { Teacher, TeacherUpdate } from '@/app/dashboard/teachers/page'
import { useSubjectsList } from '@/hooks/useSubjects'
import { useDegreesList, useEditTeacher, useTeacherProfile, useTeacherWorkloadInfo } from '@/hooks/useTeachers'
import useUserInfo from '@/hooks/useUserInfo'
import { SolarPenNewSquareBroken } from '@/icons/PencilIcon'
import { SolarUserBroken } from '@/icons/UserIcon'
import { dateFormatter } from '@/lib/composables'
import { notifyError, notifySuccess } from '@/lib/notify'
import Image from 'next/image'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Loader from './Loader'
import TakeLesson from './profile/TakeLesson'
import EditCertificate from './profile/EditCertificate'

export type WorkloadFormula = {
  "x": number,
  "total": number,
  "teachers": [
    {
      "teacher": Teacher,
      "hour": number
    }
  ],
  "mode": number
}

export default function TeacherProfile() {
  const image = null
  const currentUser = useUserInfo()
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();
  const teacherResponse = useTeacherProfile(currentUser?.id)
  const teacher = teacherResponse?.data?.data?.[0]
  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data
  const workloadInfoResponse = useTeacherWorkloadInfo();
  const workloadInfo = workloadInfoResponse?.data?.data[0]
  const degreesResponse = useDegreesList();
  const degrees = degreesResponse?.data?.data

  function getDegree(id: string) {
    return degrees?.find(deg => deg?.id === id)?.description
  }

  useEffect(() => {
    reset({ ...teacher })
  }, [reset, teacher])

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi")
      teacherResponse.refetch()
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
    } else return;
  }, [isSuccess, error]);

  function getSelectData(sv: string) {
    register("subjectId", { value: sv })
  }

  const onSubmit: SubmitHandler<TeacherUpdate> = (data) => editTeacher(data);

  if (teacherResponse.isLoading) {
    return <Loader />
  }

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-1 space-y-4 bg-white rounded md:p-5 md:grid-cols-2">
        <div className="flex items-start space-x-4 scale-90 md:scale-100">
          {
            image ?
              <div>
                <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                  className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down" />
              </div> :
              <div>
                <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
              </div>
          }
          <div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                F.I.SH:
              </div>
              <div className="text-lg font-medium capitalize">
                {teacher?.fullName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Telefon:
              </div>
              <div className="text-lg font-medium">
                {teacher?.phone}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Jinsi:
              </div>
              <div className="text-lg font-medium">
                {teacher?.gender.includes('female') ? 'Ayol' : 'Erkak'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Fani:
              </div>
              <div className="text-lg font-medium">
                {teacher?.subjects?.join(', ') ?? "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Daraja:
              </div>
              <div className="text-lg font-medium capitalize">
                {teacher?.degree ?? "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Millati:
              </div>
              <div className="text-lg font-medium capitalize">
                {teacher?.nationality ?? "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Hujjat turi:
              </div>
              <div className="text-lg font-medium capitalize">
                {teacher?.documentType}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Hujjat raqami:
              </div>
              <div className="text-lg font-medium capitalize">
                {teacher?.documentSeries} {teacher?.documentNumber}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">
                Yaratilgan sana:
              </div>
              <div className="text-lg font-medium">
                {dateFormatter(teacher?.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div>
            <div className='w-full p-3 border rounded-lg md:w-96 h-fit'>
              <h1 className='font-bold'>Dars bo`lish formulasi</h1>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  X:
                </div>
                <div className="text-lg font-medium">
                  {workloadInfo?.x ?? 0}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  Jami:
                </div>
                <div className="text-lg font-medium">
                  {workloadInfo?.total ?? 0}
                </div>
              </div>
              {workloadInfo?.teachers?.map((info, idx) => {
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      {info?.teacher?.fullName}:
                    </div>
                    <div className="text-lg font-medium">
                      {info?.hour}
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  Qoldiq:
                </div>
                <div className="text-lg font-medium">
                  {workloadInfo?.mode}
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-start justify-center w-full my-3 space-x-3 md:justify-end md:my-0'>
            <Dialog>
              <DialogTrigger>
                <Button>
                  <SolarPenNewSquareBroken className='w-6 h-6 mr-2' />
                  Profilni tahrirlash
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Profilni tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full space-y-4 bg-white rounded">
                    <div className="flex items-start space-x-4">
                      <div className='hidden md:block'>
                        {
                          image ?
                            <div>
                              <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                                className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down" />
                            </div> :
                            <div>
                              <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
                            </div>
                        }
                      </div>
                      <div className="w-full space-y-3">
                        <div className="flex items-center w-full space-x-2">
                          <div className="text-base text-gray-500">
                            F.I.SH:
                          </div>
                          <div className="w-full text-lg font-medium capitalize">
                            <Input type="text" className="w-full" {...register("fullName", { required: false })} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">
                            Telefon:
                          </div>
                          <div className="w-full text-lg font-medium capitalize">
                            <Input className="w-full" {...register("phone", { required: false })} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">
                            Fani:
                          </div>
                          <div className="w-full text-lg font-medium">
                            <Select onValueChange={(val) => getSelectData(val)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Fanlar..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup className="overflow-auto h-52">
                                  {subjects?.map(({ name, id }) => {
                                    return (
                                      <SelectItem key={id} value={id}>{name}</SelectItem>
                                    )
                                  })}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">
                            Yaratilgan sana:
                          </div>
                          <div className="text-lg font-medium">
                            {dateFormatter(teacher?.createdAt)}
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
            <TakeLesson />
          </div>
        </div>
      </div>
      <div className='items-center justify-start md:space-x-3 md:flex md:flex-wrap'>
        {!teacherResponse.isLoading ?
          teacher?.documents?.map(({ id, certificateId, approved }) => {
            return (
              <div key={id} className='p-1 my-3 bg-white border shadow rounded-xl'>
                <div className='my-3 w-96'>{getDegree(id)}</div>
                <div className="relative bg-white border border-gray-200 rounded-lg shadow h-96 w-[350px] md:w-96 dark:bg-gray-800 dark:border-gray-700">
                  <Image src={`http://25-school.uz/school/api/v1/asset/${certificateId}` ?? ''} alt="Hujjat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
                  {
                    approved ? "" :
                      <div className='absolute top-5 right-5 hover:cursor-pointer hover:scale-105'>
                        <EditCertificate degId={id} />
                      </div>
                  }
                </div>
                {
                  approved ?
                    <h1 className='text-green-500'>Tasdiqlangan</h1> :
                    <h1 className='text-red-500'>Tasdiqlanmagan</h1>
                }
              </div>
            )
          }) : <Loader />
        }
      </div>
      {/* <div>
        <div className='flex items-center justify-between'>
          <div className="text-xl font-bold">Sertifikatlar</div>
          <Button disabled={true}>
            <SolarAddCircleBroken className='w-6 h-6 mr-2' />
            Sertifikat qo`shish
          </Button>
        </div>
        <div className="overflow-auto max-h-48 xxl:overflow-x-hidden customer-tariffs-wrapper">
          <table className="w-full table-auto min-w-max">
            <thead className="sticky top-0 z-10 bg-white shadow">
              <tr className="text-lg leading-normal text-gray-600 capitalize">
                <th className="px-4 py-2 text-center">No</th>
                <th className="px-4 py-2 text-left">Bergan tashkilot</th>
                <th className="px-4 py-2 text-left">Hujjat seriyasi</th>
                <th className="px-4 py-2 text-left">Nomer</th>
                <th className="px-4 py-2 text-center">Fan</th>
                <th className="px-4 py-2 text-center">Berilgan sanasi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-gray-600">

            </tbody>
          </table>
          <div className="w-full text-center text-red-500">Hech nima topilmadi</div>
        </div>
      </div> */}
    </div >
  )
}
