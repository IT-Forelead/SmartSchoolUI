import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useTeacherProfile,
  useUpdateTeacherPosition,
} from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarPenNewSquareBroken } from "@/icons/PencilIcon";
import { notifyError, notifySuccess, notifyWarn } from "@/lib/notify";
import { TeacherPositionUpdate } from "@/models/common.interface";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function EditCertificate(prop: { degId: string }) {
  const { handleSubmit, setValue } = useForm<TeacherPositionUpdate>();
  const {
    mutate: updateTeacherPosition,
    isSuccess,
    error,
    isLoading,
  } = useUpdateTeacherPosition();

  const onSubmit: SubmitHandler<TeacherPositionUpdate> = (data) =>
    updateTeacherPosition(data);

  const user = useUserInfo();

  const teacherResponse = useTeacherProfile(user?.User?.id);

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      teacherResponse.refetch();
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
    } else return;
  }, [isSuccess, error]);

  function catchFile(e: any) {
    if (e.target.files[0].type.includes("image")) {
      setValue("degreeId", prop?.degId);
      setValue("teacherId", user?.User?.id);
      setValue("filename", e.target.files[0]);
    } else {
      notifyWarn("Boshqa formatdagi file kiritdingiz!");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <SolarPenNewSquareBroken className="h-6 w-6 text-blue-600" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dars olishni tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} method="POST" content="">
            <div className="mb-3 w-full space-y-4 rounded bg-white">
              <div className="flex items-start space-x-4">
                <div className="w-full space-y-3">
                  <div className="flex w-full items-center text-gray-500">
                    Sertifikat:{" "}
                    <Input
                      id="file"
                      type="file"
                      className="ml-2"
                      onChange={(event) => catchFile(event)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              {!isLoading ? (
                <Button autoFocus={true}>Saqlash</Button>
              ) : (
                <Button disabled className="select-none">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saqlanmoqda...
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
