"use client"

import AdminProfile from "@/components/client/AdminProfile"
import TeacherProfile from "@/components/client/TeacherProfile"
import { UserInfo } from "@/models/user.interface"
import { getCookie } from "cookies-next"

export default function ProfilePage() {
  const currentUser = JSON.parse(getCookie('user-info') + "") as UserInfo
  return (
    <>
      {currentUser.role === 'admin' ?
        <AdminProfile /> :
        <TeacherProfile />
      }
    </>
  )
}