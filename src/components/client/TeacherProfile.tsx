import { TeacherUpdate } from '@/app/dashboard/teachers/page'
import { useSubjectsList } from '@/hooks/useSubjects'
import { useEditTeacher, useTeacherProfile } from '@/hooks/useTeachers'
import { SolarPenNewSquareBroken } from '@/icons/PencilIcon'
import { SolarAddCircleBroken } from '@/icons/PlusIcon'
import { SolarUserBroken } from '@/icons/UserIcon'
import { dateFormater } from '@/lib/composables'
import { UserInfo } from '@/models/user.interface'
import { getCookie } from 'cookies-next'
import Image from 'next/image'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { notifyError, notifySuccess } from '@/lib/notify'
import { Loader } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function TeacherProfile() {
  const image = null
  const currentUser = JSON.parse(getCookie('user-info') + "") as UserInfo
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();
  const teacherResponse = useTeacherProfile(currentUser.id)
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
        <div className='flex items-start justify-end w-full'>
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
        </div>
      </div>
      <div>
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
      </div>
    </div>
  )
}
