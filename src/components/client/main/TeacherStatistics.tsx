"use client";

import { SolarUsersGroupRoundedBroken } from "@/icons/TeacherIcon";
import { SolarQrCodeBroken } from "@/icons/QrCodeIcon";
import { SolarUserCheckBroken } from "@/icons/UserCheckIcon";
import { SolarUserBlockBroken } from "@/icons/UserBlockIcon";
import { useTeacherStats } from "@/hooks/useTeachers";

export default function TeacherStatistics() {
  const { data, isError, isLoading } = useTeacherStats();

  return (
    <div className="col-span-2 w-full space-y-4 rounded-lg border bg-white p-5 dark:border-slate-600 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xl font-semibold">
            O`qituvchilar statistikasi
          </div>
          <div className="text-base text-gray-600 dark:text-gray-400">
            O`qituvchilarga oid statistika
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-green-500 p-3 dark:bg-green-700">
          <SolarUsersGroupRoundedBroken className="h-8 w-8 text-white dark:text-gray-100" />
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-green-100 p-2 dark:bg-green-800">
              <SolarUsersGroupRoundedBroken className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <div className="text-lg font-semibold">Barcha o`qituvchilar</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Barcha o`qituvchilar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{data?.data?.total ?? 0}</div>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-blue-100 p-2 dark:bg-blue-800">
              <SolarQrCodeBroken className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <div className="text-lg font-semibold">QR kod briktirilgan</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                QR kod biriktirilganlar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">
            {data?.data?.qrCodeAssigned ?? 0}
          </div>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-orange-100 p-2 dark:bg-orange-800">
              <SolarUserCheckBroken className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <div className="text-lg font-semibold">Hozirda maktabda</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hozirda maktabda bo`lganlar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{data?.data?.inSchool ?? 0}</div>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-red-100 p-2 dark:bg-red-800">
              <SolarUserBlockBroken className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <div className="text-lg font-semibold">Bugun kelmaganlari</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bugun maktabga kelmaganlar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">
            {data?.data?.didNotCome ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}
