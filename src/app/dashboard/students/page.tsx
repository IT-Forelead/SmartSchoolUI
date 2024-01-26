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
  PencilIcon,
  QrCodeIcon,
  TrashIcon,
} from "lucide-react";
import * as React from "react";
import Loader from "@/components/client/Loader";
import CreateStudent from "@/components/client/students/CreateStudent";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAddQrcodeToStudent,
  useDeleteBarCodeStudent,
  useEditStudent,
  useStudentsList,
  useDeleteStudent,
  useEditStudentSmsOptOut,
} from "@/hooks/useStudents";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { dateFormatter } from "@/lib/composables";
import { notifyError, notifySuccess } from "@/lib/notify";
import { Student, StudentUpdate, AddQrCode } from "@/models/common.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const getGroupNameAndLevel = (group: { name: any; level: any }) => {
  if (group && group.name && group.level) {
    return `${group.level} - ${group.name}`;
  } else {
    return "Sinfi yo'q";
  }
};

export const columns = (
  setStudent: Dispatch<SetStateAction<Student | null>>,
  showStudents: any,
  editSmsOptOutFunc: any,
): ColumnDef<Student, any>[] => [
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
    accessorKey: "group",
    header: "Sinfi",
    cell: ({ row }) => (
      <div className="uppercase">
        {getGroupNameAndLevel(row.getValue("group"))}
      </div>
    ),
  },
  {
    accessorKey: "parentPhone",
    header: "Ota onasining raqami",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("parentPhone") ?? "-"}</div>
    ),
  },
  {
    id: "actions",
    header: "Amallar",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center">
          <Button variant="ghost">
            <DialogTrigger onClick={() => showStudents("qrcode", student)}>
              <QrCodeIcon
                className={cn(
                  "h-5 w-5",
                  student.barcode
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-red-600 dark:text-red-500",
                )}
              />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showStudents("show", student)}>
              <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showStudents("update", student)}>
              <PencilIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showStudents("delete", student)}>
              <TrashIcon className="dark:text-500 h-5 w-5 text-red-600" />
            </DialogTrigger>
          </Button>
          <Button variant="ghost">
            <DialogTrigger onClick={() => showStudents("qr-delete", student)}>
              <QrCodeIcon className="h-5 w-5 text-red-900 dark:text-red-700" />
            </DialogTrigger>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Switch checked={!student.smsOptOut} onCheckedChange={value=> editSmsOptOutFunc(student.id, !value)}/>
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

export default function StudentsPage() {
  const currentUser = useUserInfo();
  const router = useRouter();

  function showStudents(mode: string, student: Student) {
    setMode(mode);
    setStudent(student);
  }

  const socketUrl = process.env.NEXT_PUBLIC_WS_URI ?? "";
  const { lastJsonMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (!currentUser?.User?.role?.includes("admin")) {
      router.push("/dashboard/denied");
    }
  }, [currentUser?.User?.role, router]);
  const [student, setStudent] = useState<Student | null>(null);
  const [mode, setMode] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { mutate: editStudent, isSuccess, error } = useEditStudent();
  const { mutate: deleteStudent } = useDeleteStudent();
  const { mutate: editSmsOptOut, isSuccess: isSuccessSmsOptOut, error: changeSmsOptOutError } = useEditStudentSmsOptOut();
  const {
    mutate: addQrCodeToStudent,
    isSuccess: isSuccessAddQrcode,
    error: addCrcodeError,
  } = useAddQrcodeToStudent();
  const { register, handleSubmit, reset } = useForm<StudentUpdate>();
  const {
    register: qrCodeRegister,
    handleSubmit: qrCodeHandleSubmit,
    setValue,
    getValues,
  } = useForm<AddQrCode>();
  const {
    mutate: deleteBarcode,
    isSuccess: isSuccessDeleteBarcode,
    error: deleteBarcodeError,
  } = useDeleteBarCodeStudent();

  function editSmsOptOutFunc(personId: string, optOut: boolean) {
    editSmsOptOut({personId: personId, optOut: optOut});
  }

  useEffect(() => {
    if (isSuccessDeleteBarcode) {
      notifySuccess("O`quvchining QR-kodi o'chirildi");
      refetch();
      setOpen(false);
    } else if (deleteBarcodeError) {
      notifyError("QR-kodni o`chirishda muammo yuzaga keldi");
    } else return;
  }, [isSuccessDeleteBarcode, deleteBarcodeError]);

  useEffect(() => {
    if (isSuccessSmsOptOut) {
      refetch();
    } else if (changeSmsOptOutError) {
      notifyError("SMS xabarnoma holatini o'zgartirishda muammo yuzaga keldi");
    } else return;
  }, [isSuccessSmsOptOut, changeSmsOptOutError]);

  useEffect(() => {
    reset({ ...student });
  }, [reset, student]);

  useEffect(() => {
    if (mode === "qrcode" && lastJsonMessage?.kind === "qr_code_assign") {
      setValue("qrcodeId", lastJsonMessage?.data ?? "");
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (mode === "qrcode") {
      setValue("personId", student?.id ?? "");
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

  const onSubmit: SubmitHandler<StudentUpdate> = (data) => editStudent(data);
  const onSubmitAddQrcode: SubmitHandler<AddQrCode> = (data) =>
    addQrCodeToStudent(data);
  const { data, isError, isLoading, refetch } = useStudentsList();

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi");
      refetch();
      setOpen(false);
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi");
    } else return;
  }, [isSuccess, error]);

  let students = data?.data ?? [];
  const table = useReactTable({
    data: students,
    columns: columns(setStudent, showStudents, editSmsOptOutFunc),
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
  const deleteStudentBarCode = async (data: string | undefined) => {
    // @ts-ignore
    deleteBarcode(data);
    console.log(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={mode?.includes("show") ? `max-w-5xl` : `max-w-2xl`}
      >
        <DialogHeader>
          {mode?.includes("show") ? (
            <DialogTitle>O&apos;quvchi ma&apos;lumotlari</DialogTitle>
          ) : mode?.includes("qrcode") ? (
            <DialogTitle>O&apos;quvchiga QR kod biriktirish</DialogTitle>
          ) : mode?.includes("qr-delete") ? (
            <DialogTitle>O&apos;quvchi QR kodini o&apos;chirish</DialogTitle>
          ) : mode?.includes("update") ? (
            <DialogTitle>O&apos;quvchini tahrirlash</DialogTitle>
          ) : mode?.includes("delete") ? (
            <DialogTitle>O&apos;quvchini o&apos;chirish</DialogTitle>
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
                    <div className="text-lg font-medium uppercase">
                      {student?.fullName}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Sinfi:</div>
                    <div className="text-lg font-medium">
                      {student?.group?.level}-{student?.group?.name}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Telefon:</div>
                    <div className="text-lg font-medium">
                      {student?.parentPhone}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">QR kod:</div>
                    <div className="text-lg font-medium">
                      {student?.barcode ? student?.barcode : "-"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Jinsi:</div>
                    <div className="text-lg font-medium">
                      {student?.gender.includes("female") ? "Ayol" : "Erkak"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Millati:</div>
                    <div className="text-lg font-medium capitalize">
                      {student?.nationality ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Hujjat turi:</div>
                    <div className="text-lg font-medium capitalize">
                      {student?.documentType}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Hujjat raqami:
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {student?.documentSeries} {student?.documentNumber}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Yaratilgan sana:
                    </div>
                    <div className="text-lg font-medium">
                      {dateFormatter(student?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
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
                      className="h-32 w-32 cursor-zoom-out rounded-lg border object-cover duration-500 hover:object-scale-down dark:border-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <SolarUserBroken className="h-32 w-32 rounded-lg border p-1.5 text-gray-500 dark:border-slate-600" />
                  </div>
                )}
                <div className="w-full text-center text-lg font-medium uppercase">
                  {student?.fullName}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {student?.barcode ? (
                  <>
                    <QrCodeIcon className="h-8 w-8 text-gray-500" />
                    <h1 className="-2 flex w-full border p-2 dark:border-slate-600">
                      {student.barcode}
                    </h1>
                  </>
                ) : (
                  <>
                    <QrCodeIcon className="h-8 w-8 text-gray-500" />
                    <Input
                      className="w-full text-base font-bold uppercase text-green-900  placeholder:font-medium placeholder:normal-case"
                      placeholder="QR kodni skanerlang..."
                      {...qrCodeRegister("qrcodeId", { required: true })}
                      disabled
                    />
                  </>
                )}
              </div>
              <div className="flex items-center justify-end">
                <Button autoFocus={true}>
                  <SolarCheckCircleBroken className="mr-2 h-6 w-6" />
                  QR kod biriktirish
                </Button>
              </div>
            </div>
          </form>
        ) : mode?.includes("qr-delete") ? (
          <div className="px-4 py-2">
            <p>Haqiqatdan ham QR-kodni o‘chirib tashlamoqchimisiz?</p>
            <div className="mt-4 flex items-center justify-end space-x-4">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => deleteStudentBarCode(student?.barcode)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
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
                      className="h-32 w-32 cursor-zoom-out rounded-lg border object-cover duration-500 hover:object-scale-down dark:border-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <SolarUserBroken className="h-32 w-32 rounded-lg border p-1.5 text-gray-500 dark:border-slate-600" />
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
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">Telefon:</div>
                    <div className="w-full text-lg font-medium capitalize">
                      <Input
                        className="w-full"
                        {...register("parentPhone", { required: false })}
                      />
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
            <p className="mb-2 text-lg">{student?.fullName}</p>
            <Button onClick={() => deleteStudent(student?.id ?? "")}>
              O&apos;chirish
            </Button>
          </div>
        ) : (
          <></>
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
              <CreateStudent />
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
