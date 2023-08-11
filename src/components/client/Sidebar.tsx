"use client"
import { SolarBookMinimalisticBroken } from '@/icons/BooksIcon'
import { SolarHome2Broken } from '@/icons/HomeIcon'
import { SolarUsersGroupTwoRoundedBroken } from '@/icons/GroupIcon'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import { SolarUsersGroupRoundedBroken } from '@/icons/TeacherIcon'
import { BiDoorOpen } from '@/icons/RoomIcon'

export default function Sidebar() {
  // const router = useRouter()
  return (
    <div className='flex items-center'>
      <div className='relative w-64 h-screen py-2.5 bg-white border-r border-gray-200 px-7'>
        <div>
          <h1 className='text-5xl'><span className='font-bold text-blue-600'>Edu</span><b className='font-extrabold'>CRM</b></h1>
        </div>
        <ul className='mt-20 font-medium space-y-7'>
          <li className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${false ? "text-gray-900 font-semibold" : ''}`}>
            <SolarHome2Broken className='w-6 h-6 mr-3' />
            <Link href={'/dashboard'}>Bosh sahifa</Link>
          </li>
          <li className='flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold'>
            <SolarUsersGroupRoundedBroken className='w-6 h-6 mr-3' />
            <Link href={'/dashboard/teachers'}>O`qituvchilar</Link>
          </li>
          <li className='flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold'>
            <SolarUsersGroupTwoRoundedBroken className='w-6 h-6 mr-3' />
            <Link href={'/dashboard/groups'}>Sinflar</Link>
          </li>
          <li className='flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold'>
            <BiDoorOpen className='w-6 h-6 mr-3' />
            <Link href={'/dashboard/rooms'}>Xonalar</Link>
          </li>
          <li className='flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold'>
            <SolarBookMinimalisticBroken className='w-6 h-6 mr-3' />
            <Link href={'/dashboard/subjects'}>Fanlar</Link>
          </li>
        </ul>
        <div className='absolute text-sm text-center text-gray-500 -translate-x-1/2 left-1/2 bottom-5 whitespace-nowrap'>
          Developed by <a href="http://it-forelead.uz" target='_blank' className="font-semibold hover:underline hover:text-blue-600">IT-Forelead</a>
          <p className='text-xs'>2022-{new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
