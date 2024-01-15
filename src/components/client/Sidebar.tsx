"use client";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon";
import { SolarBookMinimalisticBroken } from "@/icons/BooksIcon";
import { SolarChatRoundLineBroken } from "@/icons/ChatIcon";
import { SolarUsersGroupTwoRoundedBroken } from "@/icons/GroupIcon";
import { BiDoorOpen } from "@/icons/RoomIcon";
import { SolarAlarmBroken } from "@/icons/StudyHoursIcon";
import { SolarSquareTransferHorizontalBroken } from "@/icons/SwitchIcon";
import { SolarClockSquareBroken } from "@/icons/TeacherHourIcon";
import { SolarUsersGroupRoundedBroken } from "@/icons/TeacherIcon";
import { SolarWindowFrameBroken } from "@/icons/TimeTable";
import { SolarHome2Broken } from "@/icons/HomeIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { SolarUserCheckBroken } from "@/icons/UserCheckIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SolarUserHandsOutline } from "@/icons/StudentsIcon";

export default function Sidebar() {
  const currentUser = useUserInfo();
  const path = usePathname();
  return (
    <div>
      <h1 className="text-5xl">
        <span className="font-bold text-blue-600">25</span>
        <b className="text-3xl font-extrabold">SCHOOL</b>
      </h1>
      <div className="mt-10 max-h-[80vh] overflow-auto">
        <div className="space-y-7 font-medium">
          <Link
            href={"/dashboard"}
            className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
              path === "/dashboard" ? "font-semibold text-gray-900" : ""
            }`}
          >
            <SolarHome2Broken className="mr-3 h-6 w-6" />
            <p>Bosh sahifa</p>
          </Link>
          <Link
            href={"/dashboard/last-visits"}
            className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
              path === "/dashboard/last-visits"
                ? "font-semibold text-gray-900"
                : ""
            }`}
          >
            <SolarUserCheckBroken className="mr-3 h-6 w-6" />
            <p>So`ngi tashriflar</p>
          </Link>
          <Link
            href={"/dashboard/studyhours"}
            className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
              path === "/dashboard/studyhours"
                ? "font-semibold text-gray-900"
                : ""
            }`}
          >
            <SolarAlarmBroken className="mr-3 h-6 w-6" />
            <p>Dars soatlari</p>
          </Link>
          <Link
            href={"/dashboard/timetable"}
            className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
              path === "/dashboard/timetable"
                ? "font-semibold text-gray-900"
                : ""
            }`}
          >
            <SolarWindowFrameBroken className="mr-3 h-6 w-6" />
            <p>Dars jadvali</p>
          </Link>
        </div>
        {currentUser?.User?.role?.includes("admin") ? (
          <div className="mt-7 space-y-7 font-medium">
            <Link
              href={"/dashboard/visits"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/visits"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarUserCheckBroken className="mr-3 h-6 w-6" />
              <p>Tashriflar</p>
            </Link>
            <Link
              href={"/dashboard/teachers"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/teachers"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarUsersGroupRoundedBroken className="mr-3 h-6 w-6" />
              <p>O`qituvchilar</p>
            </Link>
            <Link
              href={"/dashboard/students"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/students"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarUserHandsOutline className="mr-3 h-6 w-6" />
              <p>O`quvchilar</p>
            </Link>
            <Link
              href={"/dashboard/waitaccept"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/waitaccept"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarCheckCircleBroken className="mr-3 h-6 w-6" />
              <p>Tasdiqlash</p>
            </Link>
            <Link
              href={"/dashboard/groups"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/groups"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarUsersGroupTwoRoundedBroken className="mr-3 h-6 w-6" />
              <p>Sinflar</p>
            </Link>
            <Link
              href={"/dashboard/rooms"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/rooms" ? "font-semibold text-gray-900" : ""
              }`}
            >
              <BiDoorOpen className="mr-3 h-6 w-6" />
              <p>Xonalar</p>
            </Link>
            <Link
              href={"/dashboard/subjects"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/subjects"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarBookMinimalisticBroken className="mr-3 h-6 w-6" />
              <p>Fanlar</p>
            </Link>
            <Link
              href={"/dashboard/messages"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/messages"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarChatRoundLineBroken className="mr-3 h-6 w-6" />
              <p>SMS xabarlar</p>
            </Link>
            <Link
              href={"/dashboard/lesson/hours"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/lesson/hours"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarClockSquareBroken className="mr-3 h-6 w-6" />
              <p>Dars soatlarini boshqarish</p>
            </Link>
            <Link
              href={"/dashboard/substitution"}
              className={`flex cursor-pointer items-center text-gray-500 transition-all duration-300 hover:font-semibold hover:text-gray-900 ${
                path === "/dashboard/substitution"
                  ? "font-semibold text-gray-900"
                  : ""
              }`}
            >
              <SolarSquareTransferHorizontalBroken className="mr-3 h-6 w-6" />
              <p>Dars almashtirishlar</p>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-sm text-gray-500">
        &copy;{" "}
        <a
          href="http://it-forelead.uz"
          target="_blank"
          className="font-semibold hover:text-blue-600 hover:underline"
        >
          IT-Forelead
        </a>{" "}
        2021-{new Date().getFullYear()}
        <p className="text-xs">All Rights Reserved.</p>
      </div>
    </div>
  );
}
