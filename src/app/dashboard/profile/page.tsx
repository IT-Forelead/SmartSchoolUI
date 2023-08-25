"use client"

import AdminProfile from "@/components/client/AdminProfile"
import TeacherProfile from "@/components/client/TeacherProfile"
import useUserInfo from "@/hooks/useUserInfo"

export default function ProfilePage() {
  const currentUser = useUserInfo()
  return (
    <>
      {currentUser?.role?.includes('admin') ?
        <AdminProfile /> :
        <TeacherProfile />
      }
    </>
  )
}