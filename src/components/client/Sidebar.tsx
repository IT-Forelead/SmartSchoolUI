"use client"
import useUserInfo from '@/hooks/useUserInfo'
import { SolarCheckCircleBroken } from '@/icons/ApproveIcon'
import { SolarBookMinimalisticBroken } from '@/icons/BooksIcon'
import { SolarChatRoundLineBroken } from '@/icons/ChatIcon'
import { SolarUsersGroupTwoRoundedBroken } from '@/icons/GroupIcon'
import { SolarHome2Broken } from '@/icons/HomeIcon'
import { BiDoorOpen } from '@/icons/RoomIcon'
import { SolarAlarmBroken } from '@/icons/StudyHoursIcon'
import { SolarSquareTransferHorizontalBroken } from '@/icons/SwitchIcon'
import { SolarClockSquareBroken } from '@/icons/TeacherHourIcon'
import { SolarUsersGroupRoundedBroken } from '@/icons/TeacherIcon'
import { SolarWindowFrameBroken } from '@/icons/TimeTable'
import { SolarUserBroken } from '@/icons/UserIcon'
import { SolarUserCheckBroken } from '@/icons/UserCheckIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {SolarUserHandsOutline} from "@/icons/StudentsIcon";

export default function Sidebar() {
  const currentUser = useUserInfo()
  const path = usePathname()
  return (
    <div>
      <div>
        <h1 className='text-5xl'><span className='font-bold text-blue-600'>25</span><b className='text-3xl font-extrabold'>SCHOOL</b></h1>
      </div>
      <div className='max-h-[60vh] mt-20 overflow-auto'>
        <div className='font-medium space-y-7'>
          {/* <Link href={'/dashboard'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarHome2Broken className='w-6 h-6 mr-3' />
            <p>Bosh sahifa</p>
          </Link> */}
{currentUser?.User?.role?.includes('admin') ?
          <div className='font-medium space-y-7 mt-7'>
          <Link href={'/dashboard/visits'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/visits' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarUserCheckBroken className='w-6 h-6 mr-3' />
              <p>Tashriflar</p>
              </Link> </div> :
            <div className='font-medium mt-7 space-y-7'>
            <Link href={'/dashboard/profile'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/profile' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarUserBroken className='w-6 h-6 mr-3' />
              <p>Profil</p>
            </Link>
          </div>

          }
          <Link href={'/dashboard/last-visits'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/visits' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarUserCheckBroken className='w-6 h-6 mr-3' />
              <p>So'ngi tashriflar</p>
          </Link>
          <Link href={'/dashboard/studyhours'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/studyhours' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarAlarmBroken className='w-6 h-6 mr-3' />
            <p>Dars soatlari</p>
          </Link>
          <Link href={'/dashboard/timetable'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/timetable' ? "text-gray-900 font-semibold" : ''}`}>
            <SolarWindowFrameBroken className='w-6 h-6 mr-3' />
            <p>Dars jadvali</p>
          </Link>
        </div>
        {currentUser?.User?.role?.includes('admin') ?
          <div className='font-medium space-y-7 mt-7'>
            <Link href={'/dashboard/teachers'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/teachers' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarUsersGroupRoundedBroken className='w-6 h-6 mr-3' />
              <p>O`qituvchilar</p>
            </Link>

              <Link href={'/dashboard/students'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/students' ? "text-gray-900 font-semibold" : ''}`}>
                  <SolarUserHandsOutline className='w-6 h-6 mr-3' />
                  <p>O`quvchilar</p>
              </Link>
            <Link href={'/dashboard/waitaccept'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/waitaccept' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarCheckCircleBroken className='w-6 h-6 mr-3' />
              <p>Tasdiqlash</p>
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
            <Link href={'/dashboard/messages'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/messages' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarChatRoundLineBroken className='w-6 h-6 mr-3' />
              <p>SMS xabarlar</p>
            </Link>
            <Link href={'/dashboard/lesson/hours'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/lesson/hours' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarClockSquareBroken className='w-6 h-6 mr-3' />
              <p>Dars soatlarini boshqarish</p>
            </Link>
            <Link href={'/dashboard/substitution'} className={`flex items-center text-gray-500 transition-all duration-300 cursor-pointer hover:text-gray-900 hover:font-semibold ${path === '/dashboard/substitution' ? "text-gray-900 font-semibold" : ''}`}>
              <SolarSquareTransferHorizontalBroken className='w-6 h-6 mr-3' />
              <p>Dars almashtirishlar</p>
            </Link>
          </div> : ""
        }
      </div>
      <div className='absolute text-sm text-center text-gray-500 -translate-x-1/2 left-1/2 bottom-5 whitespace-nowrap'>
        Developed by <a href="http://it-forelead.uz" target='_blank' className="font-semibold hover:underline hover:text-blue-600">IT-Forelead</a>
        <p className='text-xs'>2022-{new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
