import {SolarUsersGroupRoundedBroken} from "@/icons/TeacherIcon";
import {SolarQrCodeBroken} from "@/icons/QrCodeIcon";
import {SolarUserCheckBroken} from "@/icons/UserCheckIcon";
import {SolarUserBlockBroken} from "@/icons/UserBlockIcon";

export default function TeacherStatistics() {
    return (
        <div className="col-span-2 bg-white rounded-lg w-full p-5 border space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <div className="text-xl font-semibold">O`qituvchilar statistikasi</div>
                    <div className="text-base text-gray-600">O`qituvchilarga oid statistika</div>
                </div>
                <div className="rounded-xl p-3 bg-green-500 flex items-center justify-center">
                    <SolarUsersGroupRoundedBroken className="w-8 h-8 text-white"/>
                </div>
            </div>
            <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center space-x-2">
                        <div className="rounded-xl p-2 bg-green-100 flex items-center justify-center">
                            <SolarUsersGroupRoundedBroken className="w-6 h-6 text-gray-900"/>
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
                            <SolarQrCodeBroken className="w-6 h-6 text-gray-900"/>
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
                            <SolarUserCheckBroken className="w-6 h-6 text-gray-900"/>
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
                            <SolarUserBlockBroken className="w-6 h-6 text-gray-900"/>
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
    )
}