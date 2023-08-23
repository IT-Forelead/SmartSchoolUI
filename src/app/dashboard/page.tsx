"use client"
import DashboardPage from '@/components/client/main/Main'
import useUserInfo from '@/hooks/useUserInfo'
import { UserInfo } from '@/models/user.interface'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const currentUser = useUserInfo()
  const router = useRouter()
  useEffect(() => {
    if(currentUser?.role === 'teacher') {
      router.push('/dashboard/profile')
    }
  }, [currentUser?.role, router])
  return (
    <>
      <DashboardPage />
    </>
  )
}
