import { TeacherUpdate } from '@/app/dashboard/teachers/page'
import { useSubjectsList } from '@/hooks/useSubjects'
import { useEditTeacher, useTeacherProfile } from '@/hooks/useTeachers'
import useUserInfo from '@/hooks/useUserInfo'
import { SolarPenNewSquareBroken } from '@/icons/PencilIcon'
import { SolarUserBroken } from '@/icons/UserIcon'
import { dateFormater } from '@/lib/composables'
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

export default function TeacherProfile() {
  const image = null
  const currentUser = useUserInfo()
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();
  const teacherResponse = useTeacherProfile(currentUser?.id)
  const teacher = teacherResponse?.data?.data?.[0]
  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data

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
      <div className="grid grid-cols-2 p-5 space-y-4 bg-white rounded">
        <div className="flex items-start space-x-4">
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
                {teacher?.subjectName ?? "-"}
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
                {dateFormater(teacher?.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex items-start justify-end w-full space-x-3'>
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
                            <Select onValueChange={(val) => getSelectData(val)} defaultValue={subjects?.find(({ name }) => name === teacher?.subjectName)?.id}>
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
                            {dateFormater(teacher?.createdAt)}
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
          <div className='flex items-center justify-end mt-5'>
            <div className='p-3 border rounded-lg w-96 h-fit'>
              <h1 className='font-bold'>Dars bo`lish formulasi</h1>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  X:
                </div>
                <div className="text-lg font-medium">
                  0
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  Jami:
                </div>
                <div className="text-lg font-medium">
                  0
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  O`qituvchi Nomi 1:
                </div>
                <div className="text-lg font-medium">
                  0
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  O`qituvchi Nomi 2:
                </div>
                <div className="text-lg font-medium">
                  0
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">
                  Qoldiq:
                </div>
                <div className="text-lg font-medium">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-start space-x-5'>
        {!teacherResponse.isLoading ?
          teacher?.documents?.map(({ id, certificateId, approved }) => {
            return (
              <div key={id}>
                <div className="relative bg-white border border-gray-200 rounded-lg shadow h-96 w-96 dark:bg-gray-800 dark:border-gray-700">
                  <Image src={`http://25-school.uz/school/api/v1/asset/${certificateId}` ?? ''} alt="Hujjat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
                  {
                    approved ? "" :
                      <div className='absolute top-5 right-5 hover:cursor-pointer hover:scale-105'>
                        <EditCertificate degId={id}/>
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
