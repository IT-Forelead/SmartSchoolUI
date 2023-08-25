"use client"
import { dateFormater } from '@/lib/composables'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SolarUserBroken } from '@/icons/UserIcon'
import { Button } from '@/components/ui/button'
import { SolarCheckCircleBroken } from '@/icons/ApproveIcon'
import { SolarCloseCircleBroken } from '@/icons/RejectIcon'
import { useTeacherLinkApprove, useTeacherLinkInfo } from '@/hooks/useTeachers'
import Loader from '@/components/client/Loader'
import { type } from 'os'
import { SubmitHandler } from 'react-hook-form'
import { error } from 'console'
import Link from 'next/link'

export type TeacherLinkInfo = {
  "id": string,
  "createdAt": string,
  "dateOfBirth": string,
  "gender": "male" | "female",
  "fullName": string,
  "nationality": string,
  "citizenship": string,
  "documentType": string,
  "documentSeries": string,
  "documentNumber": string,
  "pinfl": string,
  "phone": string,
  "photo": string,
  "subjectId": string,
  "workload": number,
  "subjectName": string,
  "documents": [
    {
      "id": string,
      "teacherId": string,
      "docUrl": string,
      "approved": string
    }
  ]
}

export type Approve = {
  link: string,
  approved: boolean
}

export default function LinkPage({ params }: { params: { link: string } }) {
  const teacherLinkResponse = useTeacherLinkInfo(params.link)
  const teacher = teacherLinkResponse?.data?.data
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    setImage(teacher?.documents[0]?.docUrl as string)
  }, [teacher?.documents])

  useEffect(() => {
    if (teacherLinkResponse?.error?.response?.data) {
      setError(teacherLinkResponse?.error?.response?.data);
    }
  }, [teacherLinkResponse.error])

  const [approved, setApproved] = useState(false)

  const { data, mutate: save, isSuccess, isError, isLoading } = useTeacherLinkApprove();

  const onSubmit: SubmitHandler<Approve> = () => save({
    link: params.link,
    approved: approved
  });

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen space-y-5'>
        <h1 className='text-3xl font-bold text-red-500'>{error}</h1>
        <Link href="/">
          <Button>Bosh sahifa</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='h-screen max-w-full p-5'>
      <div className='grid w-full grid-cols-1 gap-10 p-3 bg-gray-100 shadow md:grid-cols-2 rounded-xl h-fit'>
        <div className='p-5 bg-white shadow rounded-xl'>
          <h1 className='mb-5 text-xl font-bold'>O`qituvchi ma`lumotlari</h1>
          <div className="flex flex-col items-start space-x-4 md:flex-row">
            {
              false ?
                <div>
                  <Image src={image} alt="teacher image" width={100} height={100}
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
                  {teacher?.gender?.includes('female') ? 'Ayol' : 'Erkak'}
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
                  {/* {teacher?.degree ?? "-"} */}
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
        </div>
        <div className='p-5 bg-white shadow rounded-xl'>
          <h1 className='mb-5 text-xl font-bold'>O`qituvchi sertifikati</h1>
          <div className='relative w-full h-[80vh]'>
            {
              teacherLinkResponse.isLoading ?
                <Loader /> :
                <div>
                  <Image src={image ?? ''} alt="sertifikat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
                  <form className='flex items-center justify-center w-full space-x-5'>
                    <Button className='bg-green-500 hover:bg-green-700 whitespace-nowrap' onClick={() => setApproved(true)}>
                      <SolarCheckCircleBroken className='w-6 h-6 mr-2' />
                      Tasdiqlash
                    </Button>
                    <Button className='bg-red-500 hover:bg-red-700 whitespace-nowrap' onClick={() => setApproved(false)}>
                      <SolarCloseCircleBroken className='w-6 h-6 mr-2' />
                      Bekor qilish
                    </Button>
                  </form>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}