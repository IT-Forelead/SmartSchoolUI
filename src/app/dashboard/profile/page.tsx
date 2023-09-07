"use client"

import AdminProfile from "@/components/client/AdminProfile"
import TeacherProfile from "@/components/client/TeacherProfile"
import useUserInfo from "@/hooks/useUserInfo"

export default function ProfilePage() {
  const user = useUserInfo()
  return (
    <>
      {user?.role?.includes('admin') ?
        <AdminProfile /> :
        <TeacherProfile />
      }
    </>
  )
}