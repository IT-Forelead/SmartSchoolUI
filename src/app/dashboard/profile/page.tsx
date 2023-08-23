"use client"

import AdminProfile from "@/components/client/AdminProfile"
import TeacherProfile from "@/components/client/TeacherProfile"
import useUserInfo from "@/hooks/useUserInfo"
import { UserInfo } from "@/models/user.interface"
import { getCookie } from "cookies-next"

export default function ProfilePage() {
  const currentUser = useUserInfo()
  return (
    <>
      {currentUser?.role === 'admin' ?
        <AdminProfile /> :
        <TeacherProfile />
      }
    </>
  )
}