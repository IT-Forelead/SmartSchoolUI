"use client"

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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, CopyIcon, EyeIcon, Loader2, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { approveTeacherDoc, approveTeacherDocAsAdmin, useEditTeacher, useTeachersList } from "@/hooks/useTeachers"
import { SolarUserBroken } from "@/icons/UserIcon"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"
import { notifyError, notifySuccess } from "@/lib/notify"
import { dateFormater } from "@/lib/composables"
import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { UserInfo } from "@/models/user.interface"
import Loader from "@/components/client/Loader"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubjectsList } from "@/hooks/useSubjects"
import useUserInfo from "@/hooks/useUserInfo"
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon"
import { SolarCloseCircleBroken } from "@/icons/RejectIcon"

export type TeacherDoc = {
  id: string,
  createdAt: string,
  dateOfBirth: string,
  gender: "female" | "male",
  fullName: string,
  nationality: string,
  citizenship: string,
  documentType: string,
  documentSeries: string,
  documentNumber: string,
  pinfl: string,
  phone?: string,
  photo?: string,
  subjectName: string
  degree: string,
  workload: number,
  documents: [
    {
      "id": string,
      "teacherId": string,
      "certificateId": string,
      "approved": string
    }
  ]
}

export type Teacher = {
  id: string,
  createdAt: string,
  dateOfBirth: string,
  gender: "female" | "male",
  fullName: string,
  nationality: string,
  citizenship: string,
  documentType: string,
  documentSeries: string,
  documentNumber: string,
  pinfl: string,
  phone?: string,
  photo?: string,
  subjectName: string
  degree: string,
  workload: number,
  documents: [
    {
      "id": string,
      "teacherId": string,
      "certificateId": string,
      "approved": string
    }
  ]
}

export type TeacherDegree = {
  id: string,
  description: string,
  point: number
}

export type ApproveAsAdmin = {
  "approved": boolean,
  "degreeId": string,
  "teacherId": string
}

export type TeacherUpdate = {
  id: string,
  dateOfBirth: string,
  gender: "female" | "male",
  fullName: string,
  nationality: string,
  citizenship: string,
  documentType: string,
  documentSeries: string,
  documentNumber: string,
  pinfl: string,
  degree: string,
  subjectId: string,
  phone: string
}

function returnLength(list: any) {
  return list?.length
}

export const columns = (setTeacher: React.Dispatch<React.SetStateAction<Teacher | null>>, showCertificates: any): ColumnDef<Teacher, any>[] => [
  {
    header: "No",
    cell: ({ row }) => (
      <div>{parseInt(row.id, 10) + 1}</div>
    ),
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
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('fullName')}</div>
    ),
  },
  {
    accessorKey: "subjectName",
    header: 'Fani',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('subjectName') ?? "-"}</div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: 'Tug`ilgan sanasi',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('dateOfBirth')}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: 'Telefon raqami',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('phone') ?? "-"}</div>
    ),
  },
  {
    accessorKey: "nationality",
    header: 'Millati',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('nationality') ?? "-"}</div>
    ),
  },
  {
    accessorKey: "degree",
    header: 'Darajasi',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('degree')}</div>
    ),
  },
  {
    accessorKey: "workload",
    header: 'Dars soati',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('workload') ?? 0}</div>
    ),
  },
  {
    accessorKey: "documents",
    header: 'Sertifikatlar soni',
    cell: ({ row }) => (
      <div className="capitalize">{returnLength(row.getValue('documents')) ?? 0}</div>
    ),
  },
  {
    id: "actions",
    header: "Amallar",
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Amallar</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Amallar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-gray-600"
              onClick={() => navigator.clipboard.writeText(teacher.fullName)}
            >
              <CopyIcon className="w-4 h-4 mr-1" />
              Nusxalash
            </DropdownMenuItem>
            <DropdownMenuItem className="text-green-600">
              <DialogTrigger className="flex items-center space-x-2" onClick={() => showCertificates('show', teacher)}>
                <EyeIcon className="w-4 h-4 mr-1" />
                Sertifikatlar
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-blue-600">
              <DialogTrigger className="flex items-center space-x-2" onClick={() => showCertificates('', teacher)}>
                <PencilIcon className="w-4 h-4 mr-1" />
                Tahrirlash
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <TrashIcon className="w-4 h-4 mr-1" />
              O`chirish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function TeachersPage() {
  const currentUser = useUserInfo()
  const router = useRouter()

  function showCertificates(mode: string, teacher: Teacher) {
    setMode(mode)
    setTeacher(teacher)
  }

  const [isApproving, setIsApproving] = React.useState<boolean>(false)
  const [isRejecting, setIsRejecting] = React.useState<boolean>(false)

  function approveTeacherDocument(approved: boolean, id: string) {
    if (approved) {
      setIsApproving(true)
    } else {
      setIsRejecting(true)
    }
    approveTeacherDocAsAdmin(
      {
        approved: approved,
        degreeId: id,
        teacherId: teacher?.id ?? ""
      }
    ).then(() => {
      setIsApproving(false)
      setIsRejecting(false)
      notifySuccess("Sertifikat muvaffaqiyatli tasdiqlandi")
      refetch()
    }).catch((err) => {
      notifyError("Sertifikatni tasdiqlashda muammo yuzaga keldi!")
      setTimeout(() => {
        setIsApproving(false)
        setIsRejecting(false)
      }, 2000)
    })
  }

  React.useEffect(() => {
    if (!currentUser?.role?.includes('admin')) {
      router.push('/dashboard/denied')
    }
  }, [currentUser?.role, router])
  const [teacher, setTeacher] = React.useState<Teacher | null>(null)
  const [mode, setMode] = React.useState<string>('')
  const [open, setOpen] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();

  React.useEffect(() => {
    reset({ ...teacher })
  }, [reset, teacher])

  React.useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi")
      refetch()
      setOpen(false)
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
    } else return;
  }, [isSuccess, error]);

  function getSelectData(sv: string) {
    register("subjectId", { value: sv })
  }

  const onSubmit: SubmitHandler<TeacherUpdate> = (data) => editTeacher(data);

  const { data, isError, isLoading, refetch } = useTeachersList();
  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data

  let d = data?.data ?? []
  const table = useReactTable({
    data: d,
    columns: columns(setTeacher, showCertificates),
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
  })

  if (isLoading) {
    return <Loader />
  }
  const image = null
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={mode ? `max-w-4xl` : `max-w-2xl`}>
        <DialogHeader>
          {mode ?
            <DialogTitle>O`qituvchi ma`lumotlari</DialogTitle> :
            <DialogTitle>O`qituvchi profili</DialogTitle>
          }
        </DialogHeader>
        {mode ?
          <div className="px-4 py-2">
            <div className="flex p-5 space-y-4 bg-white rounded">
              <div className="flex items-start space-x-4">
                {
                  image ?
                    <div>
                      <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                        className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down" />
                    </div> :
                    <div>
                      <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
                    </div>
                }
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      F.I.SH:
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {teacher?.fullName}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Telefon:
                    </div>
                    <div className="text-lg font-medium">
                      {teacher?.phone}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Jinsi:
                    </div>
                    <div className="text-lg font-medium">
                      {teacher?.gender.includes('female') ? 'Ayol' : 'Erkak'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Fani:
                    </div>
                    <div className="text-lg font-medium">
                      {teacher?.subjectName ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Daraja:
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {teacher?.degree ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Millati:
                    </div>
                    <div className="text-lg font-medium capitalize">
                      {teacher?.nationality ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Hujjat turi:
                    </div>
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
                      {dateFormater(teacher?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap items-center justify-start space-x-5 overflow-auto max-h-[420px]'>
              {!isLoading ?
                teacher?.documents?.map(({ id, certificateId, approved }) => {
                  return (
                    <div key={id} className="my-3">
                      <div className="relative bg-white border border-gray-200 rounded-lg shadow h-96 w-96 dark:bg-gray-800 dark:border-gray-700">
                        <Image src={`http://25-school.uz/school/api/v1/asset/${certificateId}` ?? ''} alt="Hujjat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
                        {
                          !approved ?
                            <div className='absolute z-20 flex items-center justify-center w-full space-x-5 bottom-5'>
                              {isApproving ?
                                <Button className='bg-green-400 hover:bg-green-700 whitespace-nowrap' disabled={true}>
                                  <Loader2 className='w-6 h-6 mr-2' />
                                  Tasdiqlanmoqda...
                                </Button>
                                : <Button className='bg-green-500 hover:bg-green-700 whitespace-nowrap' onClick={() => approveTeacherDocument(true, id)}>
                                  <SolarCheckCircleBroken className='w-6 h-6 mr-2' />
                                  Tasdiqlash
                                </Button>
                              }
                              {isRejecting ?
                                <Button className='bg-red-400 hover:bg-red-700 whitespace-nowrap' disabled={true}>
                                  <Loader2 className='w-6 h-6 mr-2' />
                                  Rad qilinmoqda...
                                </Button>
                                : <Button className='bg-red-500 hover:bg-red-700 whitespace-nowrap' onClick={() => approveTeacherDocument(false, id)}>
                                  <SolarCloseCircleBroken className='w-6 h-6 mr-2' />
                                  Rad qilish
                                </Button>
                              }
                            </div> : ""
                        }
                      </div>
                      {
                        approved ?
                          <h1 className='text-green-500'>Tasdiqlangan</h1> :
                          <h1 className='text-red-500'>Tasdiqlanmagan</h1>
                      }
                    </div>
                  )
                }) : <Loader />
              }
            </div>
          </div >
          : <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full space-y-4 bg-white rounded">
              <div className="flex items-start space-x-4">
                {
                  image ?
                    <div>
                      <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                        className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down" />
                    </div> :
                    <div>
                      <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5" />
                    </div>
                }
                <div className="w-full space-y-3">
                  <div className="flex items-center w-full space-x-2">
                    <div className="text-base text-gray-500">
                      F.I.SH:
                    </div>
                    <div className="w-full text-lg font-medium capitalize">
                      <Input type="text" className="w-full" {...register("fullName", { required: false })} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Telefon:
                    </div>
                    <div className="w-full text-lg font-medium capitalize">
                      <Input className="w-full" {...register("phone", { required: false })} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-base text-gray-500">
                      Fani:
                    </div>
                    <div className="w-full text-lg font-medium">
                      <Select onValueChange={(val) => getSelectData(val)} defaultValue={subjects?.find(({ name }) => name === teacher?.subjectName)?.id}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Fanlar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="overflow-auto h-52">
                            {subjects?.map(({ name, id }) => {
                              return (
                                <SelectItem key={id} value={id}>{name}</SelectItem>
                              )
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
                      {dateFormater(teacher?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button autoFocus={true}>Saqlash</Button>
            </div>
          </form>
        }
      </DialogContent>
      <div className="w-full p-5">
        <div className="flex items-center py-4">
          <Input
            placeholder="F.I.SH bo`yicha izlash..."
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              return table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Ustunlar <ChevronDown className="w-4 h-4 ml-2" />
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
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
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
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center"
                  >
                    Hech nima topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end py-4 space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
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
  )
}