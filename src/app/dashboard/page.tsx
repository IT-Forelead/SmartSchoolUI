"use client"
import DashboardPage from '@/components/client/main/Main'
import { UserInfo } from '@/models/user.interface'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const currentUser = JSON.parse(getCookie('user-info') + "") as UserInfo
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
