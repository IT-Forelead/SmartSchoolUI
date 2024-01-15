import useUserInfo from "@/hooks/useUserInfo";
import { SolarUserBroken } from "@/icons/UserIcon";
import Image from "next/image";

export default function AdminProfile() {
  const image = null;
  const currentUser = useUserInfo();
  return (
    <div className="px-4 py-2">
      <div className="space-y-4 rounded bg-white p-5">
        <div className="flex items-start space-x-4">
          {image ? (
            <div>
              <Image
                src="/public/test.png"
                alt="teacher image"
                width={100}
                height={100}
                className="h-32 w-32 cursor-zoom-out rounded-lg border object-cover duration-500 hover:object-scale-down"
              />
            </div>
          ) : (
            <div>
              <SolarUserBroken className="h-32 w-32 rounded-lg border p-1.5 text-gray-500" />
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
