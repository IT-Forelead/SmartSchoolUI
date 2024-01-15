import { useSubjectsList } from "@/hooks/useSubjects";
import {
  useDegreesList,
  useEditTeacher,
  useTeacherProfile,
  useTeacherWorkloadInfo,
} from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarPenNewSquareBroken } from "@/icons/PencilIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { dateFormatter } from "@/lib/composables";
import { notifyError, notifySuccess } from "@/lib/notify";
import Image from "next/image";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loader from "./Loader";
import TakeLesson from "./profile/TakeLesson";
import EditCertificate from "./profile/EditCertificate";
import { TeacherUpdate } from "@/models/common.interface";
import ImageFull from "./timetable/ImageFull";

export default function TeacherProfile() {
  const image = null;
  const currentUser = useUserInfo();
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();
  const teacherResponse = useTeacherProfile(currentUser?.User?.id);
  const teacher = teacherResponse?.data?.data?.[0];
  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data;
  const workloadInfoResponse = useTeacherWorkloadInfo(teacher?.subjects ?? []);
  const workloadInfo = workloadInfoResponse?.data?.data[0];
  const degreesResponse = useDegreesList();
  const degrees = degreesResponse?.data?.data;

  function getDegree(id: string) {
    return degrees?.find((deg) => deg?.id === id)?.description;
  }

  useEffect(() => {
    reset({ ...teacher });
  }, [reset, teacher]);

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      teacherResponse.refetch();
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
    } else return;
  }, [isSuccess, error]);

  function getSelectData(sv: string) {
    register("subjectId", { value: sv });
  }

  const onSubmit: SubmitHandler<TeacherUpdate> = (data) => editTeacher(data);

  if (teacherResponse.isLoading) {
    return <Loader />;
  }

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-1 space-y-4 rounded bg-white md:grid-cols-2 md:p-5">
        <div className="flex scale-90 items-start space-x-4 md:scale-100">
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
              <div className="text-base text-gray-500">F.I.SH:</div>
              <div className="text-lg font-medium capitalize">
                {teacher?.fullName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Telefon:</div>
              <div className="text-lg font-medium">{teacher?.phone}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Jinsi:</div>
              <div className="text-lg font-medium">
                {teacher?.gender.includes("female") ? "Ayol" : "Erkak"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Fani:</div>
              <div className="text-lg font-medium">
                {teacher?.subjects?.map((s) => s?.name)?.join(", ") || "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Daraja:</div>
              <div className="text-lg font-medium capitalize">
                {teacher?.degree ?? "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Millati:</div>
              <div className="text-lg font-medium capitalize">
                {teacher?.nationality ?? "-"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Hujjat turi:</div>
              <div className="text-lg font-medium capitalize">
                {teacher?.documentType}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Hujjat raqami:</div>
              <div className="text-lg font-medium capitalize">
                {teacher?.documentSeries} {teacher?.documentNumber}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500">Yaratilgan sana:</div>
              <div className="text-lg font-medium">
                {dateFormatter(teacher?.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <div className="h-fit w-full rounded-lg border p-3 md:w-96">
              <h1 className="font-bold">Dars bo`lish formulasi</h1>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">X:</div>
                <div className="text-lg font-medium">
                  {workloadInfo?.x ?? 0}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">Jami:</div>
                <div className="text-lg font-medium">
                  {workloadInfo?.total ?? 0}
                </div>
              </div>
              {workloadInfo?.teachers?.map((info, idx) => {
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      {info?.teacher?.fullName}:
                    </div>
                    <div className="text-lg font-medium">{info?.hour}</div>
                  </div>
                );
              })}
              <div className="flex items-center space-x-2">
                <div className="text-base text-gray-500">Qoldiq:</div>
                <div className="text-lg font-medium">{workloadInfo?.mode}</div>
              </div>
            </div>
          </div>
          <div className="my-3 flex w-full items-start justify-center space-x-3 md:my-0 md:justify-end">
            <Dialog>
              <DialogTrigger>
                <Button>
                  <SolarPenNewSquareBroken className="mr-2 h-6 w-6" />
                  Profilni tahrirlash
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Profilni tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full space-y-4 rounded bg-white">
                    <div className="flex items-start space-x-4">
                      <div className="hidden md:block">
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
                      </div>
                      <div className="w-full space-y-3">
                        <div className="flex w-full items-center space-x-2">
                          <div className="text-base text-gray-500">F.I.SH:</div>
                          <div className="w-full text-lg font-medium capitalize">
                            <Input
                              type="text"
                              className="w-full"
                              {...register("fullName", { required: false })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">
                            Telefon:
                          </div>
                          <div className="w-full text-lg font-medium capitalize">
                            <Input
                              className="w-full"
                              {...register("phone", { required: false })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">Fani:</div>
                          <div className="w-full text-lg font-medium">
                            <Select onValueChange={(val) => getSelectData(val)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Fanlar..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup className="h-52 overflow-auto">
                                  {subjects?.map(({ name, id }) => {
                                    return (
                                      <SelectItem key={id} value={id}>
                                        {name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-base text-gray-500">
                            Yaratilgan sana:
                          </div>
                          <div className="text-lg font-medium">
                            {dateFormatter(teacher?.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button autoFocus={true}>Saqlash</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <TakeLesson />
          </div>
        </div>
      </div>
      <div className="items-center justify-start md:flex md:flex-wrap md:space-x-3">
        {!teacherResponse.isLoading ? (
          teacher?.documents?.map(
            ({ id, certificateId, approved, rejected }) => {
              return (
                <div
                  key={id}
                  className="my-3 rounded-xl border bg-white p-1 shadow"
                >
                  <div className="my-3 w-96">{getDegree(id)}</div>
                  <div className="relative h-96 w-[350px] rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 md:w-96">
                    <div className="absolute right-5 top-5 z-30 hover:scale-105 hover:cursor-pointer">
                      <ImageFull cId={certificateId} />
                    </div>
                    <Image
                      src={
                        `http://25-school.uz/school/api/v1/asset/${certificateId}` ??
                        ""
                      }
                      alt="Hujjat"
                      layout="fill"
                      className="top-0 rounded-lg object-contain duration-500"
                    />
                    {approved || rejected ? (
                      ""
                    ) : (
                      <div className="absolute right-5 top-14 hover:scale-105 hover:cursor-pointer">
                        <EditCertificate degId={id} />
                      </div>
                    )}
                  </div>
                  {approved ? (
                    <h1 className="text-green-500">Tasdiqlangan</h1>
                  ) : rejected ? (
                    <h1 className="text-red-500">Rad etilgan</h1>
                  ) : (
                    <h1 className="text-orange-500">Tasdiqlanmagan</h1>
                  )}
                </div>
              );
            },
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
