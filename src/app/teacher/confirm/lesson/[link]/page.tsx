"use client";
import { Button } from "@/components/ui/button";
import { approveAbsentTeacherLesson } from "@/hooks/useTeachers";
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon";
import { SolarCloseCircleBroken } from "@/icons/RejectIcon";
import { notifyError } from "@/lib/notify";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinkPage({ params }: { params: { link: string } }) {
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  function approveTeacherDocument(approved: boolean) {
    if (approved) {
      setIsApproving(true);
    } else {
      setIsRejecting(true);
    }
    approveAbsentTeacherLesson({
      link: params.link,
      approved: approved,
    })
      .then(() => {
        setIsApproving(false);
        setIsRejecting(false);
        window.location.href = window.location.origin;
      })
      .catch((err: AxiosError) => {
        setError(err?.response?.data as string);
        notifyError("Darsni olishda muammo yuzaga keldi!");
        setTimeout(() => {
          setIsApproving(false);
          setIsRejecting(false);
        }, 2000);
      });
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center space-y-5">
        <h1 className="text-center text-3xl font-bold text-red-500">{error}</h1>
        <Link href="/">
          <Button>Bosh sahifa</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-screen w-full items-center justify-center space-x-5">
        {isApproving ? (
          <Button
            className="whitespace-nowrap bg-green-400 hover:bg-green-700"
            disabled={true}
          >
            <Loader2 className="mr-2 h-6 w-6" />
            Tasdiqlanmoqda...
          </Button>
        ) : (
          <Button
            className="whitespace-nowrap bg-green-500 hover:bg-green-700"
            onClick={() => approveTeacherDocument(true)}
          >
            <SolarCheckCircleBroken className="mr-2 h-6 w-6" />
            Tasdiqlash
          </Button>
        )}
        {isRejecting ? (
          <Button
            className="whitespace-nowrap bg-red-400 hover:bg-red-700"
            disabled={true}
          >
            <Loader2 className="mr-2 h-6 w-6" />
            Rad qilinmoqda...
          </Button>
        ) : (
          <Button
            className="whitespace-nowrap bg-red-500 hover:bg-red-700"
            onClick={() => approveTeacherDocument(false)}
          >
            <SolarCloseCircleBroken className="mr-2 h-6 w-6" />
            Rad qilish
          </Button>
        )}
      </div>
    </div>
  );
}
