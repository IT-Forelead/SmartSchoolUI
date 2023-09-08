"use client"
import { Button } from '@/components/ui/button'
import { approveAbsentTeacherLesson } from '@/hooks/useTeachers'
import { SolarCheckCircleBroken } from '@/icons/ApproveIcon'
import { SolarCloseCircleBroken } from '@/icons/RejectIcon'
import { notifyError } from '@/lib/notify'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LinkPage({ params }: { params: { link: string } }) {
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isRejecting, setIsRejecting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  function approveTeacherDocument(approved: boolean) {
    if (approved) {
      setIsApproving(true)
    } else {
      setIsRejecting(true)
    }
    approveAbsentTeacherLesson({
      link: params.link,
      approved: approved
    }).then(() => {
      setIsApproving(false)
      setIsRejecting(false)
      window.location.href = window.location.origin;
    }).catch((err: AxiosError) => {
      setError(err?.response?.data as string)
      notifyError("Darsni olishda muammo yuzaga keldi!")
      setTimeout(() => {
        setIsApproving(false)
        setIsRejecting(false)
      }, 2000)
    })
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen space-y-5'>
        <h1 className='text-3xl font-bold text-center text-red-500'>{error}</h1>
        <Link href="/">
          <Button>Bosh sahifa</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-center w-full h-screen space-x-5'>
        {isApproving ?
          <Button className='bg-green-400 hover:bg-green-700 whitespace-nowrap' disabled={true}>
            <Loader2 className='w-6 h-6 mr-2' />
            Tasdiqlanmoqda...
          </Button>
          : <Button className='bg-green-500 hover:bg-green-700 whitespace-nowrap' onClick={() => approveTeacherDocument(true)}>
            <SolarCheckCircleBroken className='w-6 h-6 mr-2' />
            Tasdiqlash
          </Button>
        }
        {isRejecting ?
          <Button className='bg-red-400 hover:bg-red-700 whitespace-nowrap' disabled={true}>
            <Loader2 className='w-6 h-6 mr-2' />
            Rad qilinmoqda...
          </Button>
          : <Button className='bg-red-500 hover:bg-red-700 whitespace-nowrap' onClick={() => approveTeacherDocument(false)}>
            <SolarCloseCircleBroken className='w-6 h-6 mr-2' />
            Rad qilish
          </Button>
        }
      </div>
    </div>
  )
}
