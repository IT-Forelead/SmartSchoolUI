"use client";

import { SolarUsersGroupTwoRoundedBroken } from "@/icons/GroupIcon";
import { SolarUserHandsBroken } from "@/icons/UserHandsBrokenIcon";
import { SolarQrCodeBroken } from "@/icons/QrCodeIcon";
import { SolarUserHandUpBroken } from "@/icons/UserHandUpBrokenIcon";
import { SolarUserBlockBroken } from "@/icons/UserBlockIcon";
import { useStudentStats } from "@/hooks/useStudents";

export default function StudentStatistics() {
  const { data, isError, isLoading } = useStudentStats();

  return (
    <div className="col-span-2 w-full space-y-4 rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xl font-semibold">O`quvchilar statistikasi</div>
          <div className="text-base text-gray-600">
            O`quvchilarga oid statistika
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl bg-blue-500 p-3">
          <SolarUsersGroupTwoRoundedBroken className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-green-100 p-2">
              <SolarUserHandsBroken className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <div className="text-lg font-semibold">Barcha o`quvchilar</div>
              <div className="text-sm text-gray-600">
                Barcha o`quvchilar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{data?.data?.total ?? 0}</div>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-blue-100 p-2">
              <SolarQrCodeBroken className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <div className="text-lg font-semibold">QR kod briktirilgan</div>
              <div className="text-sm text-gray-600">
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
            <div className="flex items-center justify-center rounded-xl bg-orange-100 p-2">
              <SolarUserHandUpBroken className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <div className="text-lg font-semibold">Hozirda maktabda</div>
              <div className="text-sm text-gray-600">
                Hozirda maktabda bo`lganlar soni
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">{data?.data?.inSchool ?? 0}</div>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-xl bg-red-100 p-2">
              <SolarUserBlockBroken className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <div className="text-lg font-semibold">Bugun kelmaganlari</div>
              <div className="text-sm text-gray-600">
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
