import useUserInfo from "@/hooks/useUserInfo";
import { SolarUserBroken } from "@/icons/UserIcon";
import Image from "next/image";

export default function AdminProfile() {
  const image = null;
  const currentUser = useUserInfo();
  return (
    <div className="px-4 py-2">
      <div className="p-5 space-y-4 bg-white rounded">
        <div className="flex items-start space-x-4">
          {image ? (
            <div>
              <Image
                src="/public/test.png"
                alt="teacher image"
                width={100}
                height={100}
                className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"
              />
            </div>
          ) : (
            <div>
              <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Roli:</div>
              <div className="text-lg font-medium capitalize">
                {currentUser?.User?.role}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Telefon:</div>
              <div className="text-lg font-medium">
                {currentUser?.User?.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
