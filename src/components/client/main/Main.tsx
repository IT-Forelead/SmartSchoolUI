import { Metadata } from "next"
import { SolarUsersGroupRoundedBroken } from '@/icons/TeacherIcon'
import { SolarQrCodeBroken } from '@/icons/QrCodeIcon'
import { SolarUserBlockBroken } from '@/icons/UserBlockIcon'
import { SolarUserCheckBroken } from '@/icons/UserCheckIcon'
import { SolarUserHandUpBroken } from '@/icons/UserHandUpBrokenIcon'
import { SolarUserHandsBroken } from '@/icons/UserHandsBrokenIcon'
import { SolarChatRoundLineBroken } from '@/icons/ChatIcon'
import { SolarUsersGroupTwoRoundedBroken } from '@/icons/GroupIcon'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
    <div className="flex-col hidden md:flex">
      <div className="flex-1 p-8 pt-6 space-y-4">
          <div className="grid gap-4 grid-cols-3">
            <div className="bg-white rounded-lg w-full p-5 border space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xl font-semibold">O`qituvchilar statistikasi</div>
                  <div className="text-base text-gray-600">O`qituvchilarga oid statistika</div>
                </div>
                <div className="rounded-xl p-3 bg-slate-100 flex items-center justify-center">
                  <SolarUsersGroupRoundedBroken className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-green-100 flex items-center justify-center">
                      <SolarUsersGroupRoundedBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Barcha o`qituvchilar</div>
                      <div className="text-sm text-gray-600">Barcha o`qituvchilar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">37</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-blue-100 flex items-center justify-center">
                      <SolarQrCodeBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">QR kod briktirilgan</div>
                      <div className="text-sm text-gray-600">QR kod biriktirilganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">35</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-orange-100 flex items-center justify-center">
                      <SolarUserCheckBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Hozirda maktabda</div>
                      <div className="text-sm text-gray-600">Hozirda maktabda bo`lganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">29</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-red-100 flex items-center justify-center">
                      <SolarUserBlockBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Bugun kelmaganlari</div>
                      <div className="text-sm text-gray-600">Bugun maktabga kelmaganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">1</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg w-full p-5 border space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xl font-semibold">O`quvchilar statistikasi</div>
                  <div className="text-base text-gray-600">O`quvchilarga oid statistika</div>
                </div>
                <div className="rounded-xl p-3 bg-slate-100 flex items-center justify-center">
                  <SolarUsersGroupTwoRoundedBroken className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-green-100 flex items-center justify-center">
                      <SolarUserHandsBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Barcha o`quvchilar</div>
                      <div className="text-sm text-gray-600">Barcha o`quvchilar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">428</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-blue-100 flex items-center justify-center">
                      <SolarQrCodeBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">QR kod briktirilgan</div>
                      <div className="text-sm text-gray-600">QR kod biriktirilganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">379</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-orange-100 flex items-center justify-center">
                      <SolarUserHandUpBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Hozirda maktabda</div>
                      <div className="text-sm text-gray-600">Hozirda maktabda bo`lganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">346</div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-xl p-2 bg-red-100 flex items-center justify-center">
                      <SolarUserBlockBroken className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Bugun kelmaganlari</div>
                      <div className="text-sm text-gray-600">Bugun maktabga kelmaganlar soni</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">21</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg w-full p-5 border space-y-4"></div>
          </div>


          {/* <div className="grid gap-x-4 gap-y-2 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-full">
              <h2 className="text-xl font-bold tracking-tight">O`qituvchilar statistikasi</h2>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Barcha o`qituvchilar</div>
                  <div className="text-2xl font-bold">37</div>
                  <div className="text-sm text-gray-500">Barcha o`qituvchilar soni</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-green-100 flex items-center justify-center">
                    <SolarUsersGroupRoundedBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">QR kod briktirilgan</div>
                  <div className="text-2xl font-bold">35</div>
                  <div className="text-sm text-gray-500">QR kod biriktirilgan o`qituvchilar soni</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-blue-100 flex items-center justify-center">
                    <SolarQrCodeBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Hozirda maktabda</div>
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-gray-500">Hozirda maktabda bo`lgan o`qituvchilar</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-orange-100 flex items-center justify-center">
                    <SolarUserCheckBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Bugun kelmaganlari</div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-gray-500">Bugun maktabga kelmagan o`qituvchilar</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-red-100 flex items-center justify-center">
                    <SolarUserBlockBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>

            <div className="col-span-full mt-2">
              <h2 className="text-xl font-bold tracking-tight">O`quvchilar statistikasi</h2>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Barcha o`quvchilar</div>
                  <div className="text-2xl font-bold">37</div>
                  <div className="text-sm text-gray-500">Barcha o`quvchilar soni</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-green-100 flex items-center justify-center">
                    <SolarUserHandsBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">QR kod briktirilgan</div>
                  <div className="text-2xl font-bold">35</div>
                  <div className="text-sm text-gray-500">QR kod biriktirilgan o`quvchilar soni</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-blue-100 flex items-center justify-center">
                    <SolarQrCodeBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Hozirda maktabda</div>
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-gray-500">Hozirda maktabda bo`lgan o`quvchilar</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-orange-100 flex items-center justify-center">
                    <SolarUserHandUpBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
            <div className="flex justify-between bg-white rounded-lg w-full p-5 border">
                <div className="space-y-1">
                  <div className="text-xl font-medium">Bugun kelmaganlari</div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-gray-500">Bugun maktabga kelmagan o`quvchilar</div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="rounded-xl p-3 bg-red-100 flex items-center justify-center">
                    <SolarUserBlockBroken className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
            </div>
          </div> */}
            <div className="grid gap-4 grid-cols-2">
              <div className="bg-white rounded-lg border">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-lg font-bold">Tashriflar statistikasi</div>
                    <div className="text-sm">Bir haftalik tashriflar statistikasi</div>
                  </div>
                  <div className="rounded-xl p-3 bg-whiteflex items-center justify-center">
                    <SolarUserCheckBroken className="w-7 h-7 text-gray-900" />
                  </div>
                </div>
                <div className="px-1 h-56">
                </div>
              </div>
              <div className="bg-white rounded-lg border">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-lg font-bold">SMS xabarlar statistikasi</div>
                    <div className="text-sm">Bir haftalik SMS xabarlar statistikasi</div>
                  </div>
                  <div className="rounded-xl p-3 bg-whiteflex items-center justify-center">
                    <SolarChatRoundLineBroken className="w-7 h-7 text-gray-900" />
                  </div>
                </div>
                <div className="px-1 h-56">
                </div>
              </div>
            </div>
      </div>
    </div>
  )
}