"use client"
import { SolarBookMinimalisticBroken } from '@/icons/BooksIcon'
import { SolarUsersGroupTwoRoundedBroken } from '@/icons/GroupIcon'
import { SolarHome2Broken } from '@/icons/HomeIcon'
import { BiDoorOpen } from '@/icons/RoomIcon'
import { SolarUsersGroupRoundedBroken } from '@/icons/TeacherIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const path = usePathname()
  return (
    <div className='flex items-center'>
      <div className='relative w-64 h-screen py-2.5 bg-white border-r border-gray-200 px-7'>
        <div>
          <h1 className='text-5xl'><span className='font-bold text-blue-600'>Edu</span><b className='font-extrabold'>CRM</b></h1>
        </div>
        <div className='mt-20 font-medium space-y-7'>
          <Link href={'/dashboard'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarHome2Broken className='w-6 h-6 mr-3' />
            <p>Bosh sahifa</p>
          </Link>
          <Link href={'/dashboard/teachers'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/teachers' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarUsersGroupRoundedBroken className='w-6 h-6 mr-3' />
            <p>O`qituvchilar</p>
          </Link>
          <Link href={'/dashboard/groups'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/groups' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarUsersGroupTwoRoundedBroken className='w-6 h-6 mr-3' />
            <p>Sinflar</p>
          </Link>
          <Link href={'/dashboard/rooms'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/rooms' ? "text-gray-900 font-semibold" : ''}`}>
            <BiDoorOpen className='w-6 h-6 mr-3' />
            <p>Xonalar</p>
          </Link>
          <Link href={'/dashboard/subjects'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/subjects' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarBookMinimalisticBroken className='w-6 h-6 mr-3' />
            <p>Fanlar</p>
          </Link>
        </div>
        <div className='absolute text-sm text-center text-gray-500 -translate-x-1/2 left-1/2 bottom-5 whitespace-nowrap'>
          Developed by <a href="http://it-forelead.uz" target='_blank' className="font-semibold hover:underline hover:text-blue-600">IT-Forelead</a>
          <p className='text-xs'>2022-{new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
