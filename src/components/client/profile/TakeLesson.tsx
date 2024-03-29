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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddTeacherPosition,
  useDegreesList,
  useTeacherProfile,
} from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarBoxMinimalisticBroken } from "@/icons/BoxIcon";
import { notifyError, notifySuccess, notifyWarn } from "@/lib/notify";
import { TeacherPositionUpdate } from "@/models/common.interface";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function TakeLesson() {
  const { handleSubmit, setValue } = useForm<TeacherPositionUpdate>();
  const {
    mutate: addTeacherPosition,
    isSuccess,
    error,
    isLoading,
  } = useAddTeacherPosition();

  const onSubmit: SubmitHandler<TeacherPositionUpdate> = (data) =>
    addTeacherPosition(data);

  const degreesResponse = useDegreesList();
  const degrees = degreesResponse?.data?.data;

  const user = useUserInfo();

  const teacherResponse = useTeacherProfile(user?.User?.id);

  const [selectId, setSelectId] = useState("");
  const [img, setImg] = useState("");
  function getSelectDegreeData(dId: string) {
    setSelectId(dId);
    setValue("degreeId", dId);
    setValue("teacherId", user?.User?.id);
  }

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      teacherResponse.refetch();
    } else if (error) {
      if ((error?.response?.data as string)?.includes("avval")) {
        notifyError(error?.response?.data as string);
      } else {
        notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
      }
    } else return;
  }, [isSuccess, error]);

  function catchFile(e: any) {
    if (e.target.files[0].type.includes("image")) {
      setValue("filename", e.target.files[0]);
      setImg(URL.createObjectURL(e.target.files[0]));
    } else {
      notifyWarn("Boshqa formatdagi file kiritdingiz!");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-700 hover:bg-blue-900">
            <SolarBoxMinimalisticBroken className="mr-2 h-6 w-6" />
            Dars olish
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dars olish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} method="POST" content="">
            <div className="mb-3 w-full space-y-4 rounded bg-white dark:bg-slate-900">
              <div className="flex items-start space-x-4">
                <div className="w-full space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Toifalar:</div>
                    <div className="w-full text-lg font-medium">
                      <Select onValueChange={(val) => getSelectDegreeData(val)}>
                        <SelectTrigger className="h-fit w-full text-left">
                          <SelectValue placeholder="Toifalar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-52 overflow-auto">
                            {degrees?.map(({ description, id }) => {
                              return (
                                <SelectItem
                                  key={id}
                                  value={id}
                                  className="w-[300px] overflow-auto md:w-[450px]"
                                >
                                  {description}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {selectId ? (
                    <div className="flex w-full items-center text-gray-500">
                      Sertifikat:{" "}
                      <Input
                        id="file"
                        type="file"
                        className="ml-2"
                        onChange={(event) => catchFile(event)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
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
