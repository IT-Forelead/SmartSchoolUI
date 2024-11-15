"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  EyeIcon,
  Loader2,
  PencilIcon,
  PlusCircleIcon,
  QrCodeIcon,
  TrashIcon,
} from "lucide-react";
import * as React from "react";
import Loader from "@/components/client/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateTeacher from "@/components/client/teachers/CreateTeacher";
import { useSubjectsList } from "@/hooks/useSubjects";
import {
  addSubjectToTeacherFunc,
  useAddQrcodeToTeacher,
  approveTeacherDocAsAdmin,
  useDegreesList,
  useEditTeacher,
  useTeachersList,
  useDeleteTeacher,
  useEditTeacherSmsOptOut,
} from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon";
import { SolarCloseCircleBroken } from "@/icons/RejectIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { dateFormatter } from "@/lib/composables";
import { notifyError, notifySuccess } from "@/lib/notify";
import { Teacher, TeacherUpdate, AddQrCode } from "@/models/common.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImageFull from "@/components/client/timetable/ImageFull";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { getKeyPresses } from "@/lib/keypresses";

function returnApprovedDocLength(list: any) {
  return list?.filter((doc: any) => doc.approved)?.length;
}

function returnNotApprovedDocLength(list: any) {
  return list?.filter(
    (doc: any) => doc.rejected === null && doc.approved === null,
  )?.length;
}

function returnRejectedDocLength(list: any) {
  return list?.filter((doc: any) => doc.rejected)?.length;
}

function listToString(list: any) {
  return list?.map((subject: any) => subject?.name)?.join(", ");
}

export const columns = (
  setTeacher: Dispatch<SetStateAction<Teacher | null>>,
  showCertificates: any,
  editSmsOptOutFunc: any,
): ColumnDef<Teacher, any>[] => [
  {
    header: "No",
    cell: ({ row }) => <div>{parseInt(row.id, 10) + 1}</div>,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          F.I.SH
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "subjects",
    header: "Fanlar",
    cell: ({ row }) => (
      <div className="uppercase">
        {listToString(row.getValue("subjects")) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telefon raqami",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("phone") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "workload",
    header: "Dars soati",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("workload") ?? 0}</div>
    ),
  },
  {
    accessorKey: "documents",
    header: "Sertifikatlar soni",
    cell: ({ row }) => (
      <div>
        <p className="text-green-500 dark:text-green-600">
          Tasdiqlangan:{" "}
          <b>{returnApprovedDocLength(row.getValue("documents")) ?? 0}</b>
        </p>
        <p className="text-orange-500 dark:text-orange-600">
          Tasdiqlanmagan:{" "}
          <b>{returnNotApprovedDocLength(row.getValue("documents")) ?? 0}</b>
        </p>
        <p className="text-red-500 dark:text-red-600">
          Rad etilgan:{" "}
          <b>{returnRejectedDocLength(row.getValue("documents")) ?? 0}</b>
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Amallar",
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <div className="flex items-center">
          <Button variant="ghost">
            <DialogTrigger onClick={() => showCertificates("subject", teacher)}>
              <PlusCircleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showCertificates("show", teacher)}>
              <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showCertificates("update", teacher)}>
              <PencilIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showCertificates("delete", teacher)}>
              <TrashIcon className="dark:text-500 h-5 w-5 text-red-600" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showCertificates("qrcode", teacher)}>
              <QrCodeIcon
                className={cn(
                  "h-5 w-5",
                  teacher?.barcode
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-red-600 dark:text-red-500",
                )}
              />
            </DialogTrigger>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Switch
                  checked={!teacher.smsOptOut}
                  onCheckedChange={(value) =>
                    editSmsOptOutFunc(teacher.id, !value)
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>SMS xabarnoma holati</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

export default function TeachersPage() {
  const currentUser = useUserInfo();
  const router = useRouter();

  function showCertificates(mode: string, teacher: Teacher) {
    setSubjectIdsList([]);
    setMode(mode);
    setTeacher(teacher);
  }

  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  function approveTeacherDocument(approved: boolean, id: string) {
    if (approved) {
      setIsApproving(true);
    } else {
      setIsRejecting(true);
    }
    approveTeacherDocAsAdmin({
      approved: approved,
      degreeId: id,
      teacherId: teacher?.id ?? "",
    })
      .then(() => {
        setIsApproving(false);
        setIsRejecting(false);
        notifySuccess("Sertifikat muvaffaqiyatli tasdiqlandi");
        refetch();
      })
      .catch((err) => {
        notifyError("Sertifikatni tasdiqlashda muammo yuzaga keldi!");
        setTimeout(() => {
          setIsApproving(false);
          setIsRejecting(false);
        }, 2000);
      });
  }

  const [subjectIdsList, setSubjectIdsList] = useState<string[]>([]);

  function addSubjectToTeacher() {
    setIsSaving(true);
    addSubjectToTeacherFunc({
      teacherId: teacher?.id ?? "",
      subjectIds: subjectIdsList,
    })
      .then(() => {
        notifySuccess("Fan muvaffaqiyatli qo`shildi");
        refetch();
        setIsSaving(false);
      })
      .catch((err) => {
        notifyError("Fanni qo`shishda muammo yuzaga keldi!");
        setTimeout(() => {
          setIsSaving(false);
        }, 2000);
      });
  }

  useEffect(() => {
    if (!currentUser?.User?.role?.includes("admin")) {
      router.push("/dashboard/denied");
    }
  }, [currentUser?.User?.role, router]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [mode, setMode] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const {
    mutate: addQrCodeToTeacher,
    isSuccess: isSuccessAddQrcode,
    error: addCrcodeError,
  } = useAddQrcodeToTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();
  const {
    register: qrCodeRegister,
    handleSubmit: qrCodeHandleSubmit,
    setValue,
    getValues,
  } = useForm<AddQrCode>();

  const degreesResponse = useDegreesList();
  const degrees = degreesResponse?.data?.data;
  const {
    mutate: editTeacherSmsOptOut,
    isSuccess: isSuccessTeacherSmsOptOut,
    error: editTeacherSmsOptOutError,
  } = useEditTeacherSmsOptOut();

  function getDegree(id: string) {
    return degrees?.find((deg) => deg?.id === id)?.description;
  }
  function editTeacherSmsOptOutFunc(personId: string, optOut: boolean) {
    editTeacherSmsOptOut({ personId: personId, optOut: optOut });
  }

  const [UUID, setUUID] = useState<string>("");

  const handleKeyPress = getKeyPresses(setUUID);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => window.removeEventListener("keyup", handleKeyPress);
  }, []);

  useEffect(() => {
    if (UUID.length != 36) return;
    setValue("qrcodeId", UUID);
    setUUID("");
  }, [UUID]);

  useEffect(() => {
    if (isSuccessTeacherSmsOptOut) {
      refetch();
    } else if (editTeacherSmsOptOutError) {
      notifyError("SMS xabarnoma holatini o'zgartirishda muammo yuzaga keldi");
    } else return;
  }, [isSuccessTeacherSmsOptOut, editTeacherSmsOptOutError]);

  useEffect(() => {
    reset({ ...teacher });
  }, [reset, teacher]);

  function getSelectData(order: number, sv: string) {
    if (
      (order === 0 && subjectIdsList.length !== 2) ||
      (order === 1 && subjectIdsList.length !== 2)
    ) {
      setSubjectIdsList([...subjectIdsList, sv]);
    } else {
      subjectIdsList[order] = sv;
      setSubjectIdsList(subjectIdsList);
    }
  }

  useEffect(() => {
    if (mode === "qrcode") {
      setValue("personId", teacher?.id ?? "");
    }
  }, [mode]);

  useEffect(() => {
    if (isSuccessAddQrcode) {
      notifySuccess("Qr kod qo'shildi!");
      setValue("personId", "");
      setValue("qrcodeId", "");
      refetch();
      setOpen(false);
    } else if (addCrcodeError) {
      notifyError("Qr kod qo'shishda xatolik yuz berdi!");
    } else return;
  }, [isSuccessAddQrcode, addCrcodeError]);

  const onSubmit: SubmitHandler<TeacherUpdate> = (data) => editTeacher(data);

  const onSubmitAddQrcode: SubmitHandler<AddQrCode> = (data) =>
    addQrCodeToTeacher(data);

  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data;

  const { data, isLoading, refetch } = useTeachersList();

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      refetch();
      setOpen(false);
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
    } else return;
  }, [isSuccess, error]);

  let teachers = data?.data ?? [];
  const table = useReactTable({
    data: teachers,
    columns: columns(setTeacher, showCertificates, editTeacherSmsOptOutFunc),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  table.getState().pagination.pageSize = 40;
  if (isLoading) {
    return <Loader />;
  }
  const image = null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={mode?.includes("show") ? `max-w-5xl` : `max-w-2xl`}
      >
        <DialogHeader>
          {mode?.includes("show") ? (
            <DialogTitle>O&apos;qituvchi ma&apos;lumotlari</DialogTitle>
          ) : mode?.includes("qrcode") ? (
            <DialogTitle>O&apos;qituvchiga Qr kod biriktirish</DialogTitle>
          ) : mode?.includes("subject") ? (
            <DialogTitle>O&apos;qituvchiga fan biriktirish</DialogTitle>
          ) : mode?.includes("update") ? (
            <DialogTitle>O&apos;qituvchi profili</DialogTitle>
          ) : mode?.includes("delete") ? (
            <DialogTitle>O&apos;qituvchini o&apos;chirish </DialogTitle>
          ) : (
            <DialogTitle>Unknown</DialogTitle>
          )}
        </DialogHeader>
        {mode?.includes("show") ? (
          <div className="px-4 py-2">
            <div className="flex space-y-4 rounded p-5">
              <div className="flex items-start space-x-4">
                {image ? (
                  <div>
                    <Image
                      src="/public/test.png"
                      alt="teacher image"
                      width={100}
                      height={100}
                      className="h-32 w-32 cursor-zoom-out rounded-lg border object-cover duration-500 hover:object-scale-down dark:border-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <SolarUserBroken className="h-32 w-32 rounded-lg border p-1.5 text-gray-500 dark:border-slate-600" />
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
                    <div className="text-base text-gray-500">QR kod:</div>
                    <div className="text-lg font-medium">
                      {teacher?.barcode ? teacher?.barcode : "-"}
                    </div>
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
                      {teacher?.subjects?.map((s) => s?.name)?.join(", ") ||
                        "-"}
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
                    <div className="text-base text-gray-500">
                      Hujjat raqami:
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {teacher?.documentSeries} {teacher?.documentNumber}
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
            <div className="max-h-[420px] items-center justify-start overflow-auto md:flex md:flex-wrap md:space-x-3">
              {!isLoading ? (
                teacher?.documents?.map(
                  ({ id, certificateId, approved, rejected }) => {
                    return (
                      <div
                        key={id}
                        className="my-3 rounded-xl border p-1 shadow dark:border-slate-600"
                      >
                        <div className="my-3 w-96">{getDegree(id)}</div>
                        <div className="relative h-96 w-96 rounded-lg border border-gray-200 shadow dark:border-slate-600 dark:bg-slate-800">
                          <div className="absolute right-3 top-3 z-30 hover:scale-105 hover:cursor-pointer">
                            <ImageFull cId={certificateId} />
                          </div>
                          <Image
                            src={
                              `https://data.it-forelead.uz/api/v1/asset/${certificateId}` ??
                              ""
                            }
                            alt="Hujjat"
                            layout="fill"
                            className="top-0 rounded-lg object-contain duration-500"
                          />
                          {approved || rejected ? (
                            ""
                          ) : (
                            <div className="absolute bottom-5 z-20 flex w-full items-center justify-center space-x-5">
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
                                  onClick={() =>
                                    approveTeacherDocument(true, id)
                                  }
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
                                  onClick={() =>
                                    approveTeacherDocument(false, id)
                                  }
                                >
                                  <SolarCloseCircleBroken className="mr-2 h-6 w-6" />
                                  Rad qilish
                                </Button>
                              )}
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
        ) : mode?.includes("subject") ? (
          <div className="space-y-3">
            <div className="flex w-full items-center space-x-2">
              <div className="text-base text-gray-500">F.I.SH:</div>
              <div className="w-full text-lg font-medium capitalize">
                {teacher?.fullName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="whitespace-nowrap text-base text-gray-500">
                Birinchi fan:
              </div>
              <div className="w-full text-lg font-medium">
                <Select onValueChange={(val) => getSelectData(0, val)}>
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
              <div className="whitespace-nowrap text-base text-gray-500">
                Ikkinchi fan:
              </div>
              <div className="w-full text-lg font-medium">
                <Select onValueChange={(val) => getSelectData(1, val)}>
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
            <div className="flex items-center justify-end">
              {isSaving ? (
                <Button disabled={true}>
                  <Loader2 className="mr-2 h-6 w-6" />
                  Saqlanmoqda...
                </Button>
              ) : (
                <Button onClick={() => addSubjectToTeacher()}>
                  <SolarCheckCircleBroken className="mr-2 h-6 w-6" />
                  Saqlash
                </Button>
              )}
            </div>
          </div>
        ) : mode?.includes("qrcode") ? (
          <form onSubmit={qrCodeHandleSubmit(onSubmitAddQrcode)}>
            <div className="space-y-3">
              <div className="flex w-full flex-col items-center space-y-2">
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
                <div className="w-full text-center text-lg font-medium capitalize">
                  {teacher?.fullName}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <QrCodeIcon className="h-8 w-8 text-gray-500" />
                <Input
                  className="w-full text-base font-bold uppercase text-green-900  placeholder:font-medium placeholder:normal-case"
                  placeholder="QR kodni skanerlang..."
                  {...qrCodeRegister("qrcodeId", { required: true })}
                  disabled
                />
              </div>
              <div className="flex items-center justify-end">
                <Button autoFocus={true}>
                  <SolarCheckCircleBroken className="mr-2 h-6 w-6" />
                  QR kod biriktirish
                </Button>
              </div>
            </div>
          </form>
        ) : mode?.includes("update") ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full space-y-4 rounded">
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
                  <div className="flex w-full items-center space-x-2">
                    <div className="text-base text-gray-500">Fan:</div>
                    <div className="w-full text-lg font-medium capitalize">
                      {teacher?.degree}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Telefon:</div>
                    <div className="w-full text-lg font-medium capitalize">
                      <Input
                        className="w-full"
                        {...register("phone", { required: false })}
                      />
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
        ) : mode?.includes("delete") ? (
          <div>
            <p className="mb-2 text-lg">{teacher?.fullName}</p>
            <Button onClick={() => deleteTeacher(teacher?.id ?? "")}>
              O&apos;chirish
            </Button>
          </div>
        ) : (
          <div>
            <h1>Unknown dialog</h1>
          </div>
        )}
      </DialogContent>
      <div className="w-full p-5">
        <div className="flex items-center py-4">
          <Input
            placeholder="F.I.SH bo`yicha izlash..."
            value={
              (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
            }
            className="max-w-sm"
            onChange={(event) => {
              return table
                .getColumn("fullName")
                ?.setFilterValue(event.target.value);
            }}
          />
          <div className="flex w-full items-center justify-end">
            <div className="my-3 flex items-center justify-center space-x-5">
              <CreateTeacher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Ustunlar <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="rounded-md border dark:border-slate-600">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="dark:text-slate-400"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-2 dark:text-slate-300"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Hech nima topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Jami: {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Oldingi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Keyingi
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
