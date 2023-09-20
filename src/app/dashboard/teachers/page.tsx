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
import { ArrowUpDown, ChevronDown, CopyIcon, EyeIcon, Loader2, MoreHorizontal, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-react"
import * as React from "react"

import Loader from "@/components/client/Loader"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSubjectsList } from "@/hooks/useSubjects"
import { addSubjectToTeacherFunc, approveTeacherDocAsAdmin, useDegreesList, useEditTeacher, useTeachersList } from "@/hooks/useTeachers"
import useUserInfo from "@/hooks/useUserInfo"
import { SolarCheckCircleBroken } from "@/icons/ApproveIcon"
import { SolarCloseCircleBroken } from "@/icons/RejectIcon"
import { SolarUserBroken } from "@/icons/UserIcon"
import { dateFormatter } from "@/lib/composables"
import { notifyError, notifySuccess } from "@/lib/notify"
import { Teacher, TeacherUpdate } from "@/models/common.interface"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ImageFull from "@/components/client/timetable/ImageFull"

function returnApprovedDocLength(list: any) {
  return list?.filter((doc: any) => doc.approved)?.length
}

function returnNotApprovedDocLength(list: any) {
  return list?.filter((doc: any) => doc.rejected === null && doc.approved === null)?.length
}

function returnRejectedDocLength(list: any) {
  return list?.filter((doc: any) => doc.rejected)?.length
}

function listToString(list: any) {
  return list?.map((subject: any) => subject?.name)?.join(', ')
}

export const columns = (setTeacher: Dispatch<SetStateAction<Teacher | null>>, showCertificates: any): ColumnDef<Teacher, any>[] => [
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
    accessorKey: "subjects",
    header: 'Fanlar',
    cell: ({ row }) => (
      <div className="uppercase">{listToString(row.getValue('subjects')) || "-"}</div>
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
      <div>
        <p className="text-green-500">Tasdiqlangan: <b>{returnApprovedDocLength(row.getValue('documents')) ?? 0}</b></p>
        <p className="text-orange-500">Tasdiqlanmagan: <b>{returnNotApprovedDocLength(row.getValue('documents')) ?? 0}</b></p>
        <p className="text-red-500">Rad etilgan: <b>{returnRejectedDocLength(row.getValue('documents')) ?? 0}</b></p>
      </div>
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
            <DropdownMenuItem className="text-indigo-600">
              <DialogTrigger className="flex items-center space-x-2" onClick={() => showCertificates('subject', teacher)}>
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                Fan biriktirish
              </DialogTrigger>
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
    setSubjectIdsList([])
    setMode(mode)
    setTeacher(teacher)
  }

  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isRejecting, setIsRejecting] = useState<boolean>(false)

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

  const [subjectIdsList, setSubjectIdsList] = useState<string[]>([])

  function addSubjectToTeacher() {
    setIsSaving(true)
    addSubjectToTeacherFunc(
      {
        teacherId: teacher?.id ?? "",
        subjectIds: subjectIdsList
      }
    ).then(() => {
      notifySuccess("Fan muvaffaqiyatli qo`shildi")
      refetch()
      setIsSaving(false)
    }).catch((err) => {
      notifyError("Fanni qo`shishda muammo yuzaga keldi!")
      setTimeout(() => {
        setIsSaving(false)
      }, 2000)
    })
  }

  useEffect(() => {
    if (!currentUser?.User?.role?.includes('admin')) {
      router.push('/dashboard/denied')
    }
  }, [currentUser?.User?.role, router])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [mode, setMode] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { mutate: editTeacher, isSuccess, error } = useEditTeacher();
  const { register, handleSubmit, reset } = useForm<TeacherUpdate>();

  const degreesResponse = useDegreesList();
  const degrees = degreesResponse?.data?.data

  function getDegree(id: string) {
    return degrees?.find(deg => deg?.id === id)?.description
  }

  useEffect(() => {
    reset({ ...teacher })
  }, [reset, teacher])

  function getSelectData(order: number, sv: string) {
    if (order === 0 && subjectIdsList.length !== 2 || order === 1 && subjectIdsList.length !== 2) {
      setSubjectIdsList([...subjectIdsList, sv])
    } else {
      subjectIdsList[order] = sv
      setSubjectIdsList(subjectIdsList)
    }
  }

  const onSubmit: SubmitHandler<TeacherUpdate> = (data) => editTeacher(data);

  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data

  const { data, isError, isLoading, refetch } = useTeachersList();

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("O`zgarishlar saqlandi")
      refetch()
      setOpen(false)
    } else if (error) {
      notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
    } else return;
  }, [isSuccess, error]);

  let teachers = data?.data ?? []
  const table = useReactTable({
    data: teachers,
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
      <DialogContent className={mode?.includes('show') ? `max-w-5xl` : `max-w-2xl`}>
        <DialogHeader>
          {mode?.includes('show') ?
            <DialogTitle>O`qituvchi ma`lumotlari</DialogTitle> : mode?.includes('subject') ?
              <DialogTitle>O`qituvchiga fan biriktirish</DialogTitle> :
              <DialogTitle>O`qituvchi profili</DialogTitle>
          }
        </DialogHeader>
        {mode?.includes('show') ?
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
                      {teacher?.subjects?.map(s => s?.name)?.join(', ') || "-"}
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
                      {dateFormatter(teacher?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='items-center justify-start md:space-x-3 md:flex md:flex-wrap overflow-auto max-h-[420px]'>
              {!isLoading ?
                teacher?.documents?.map(({ id, certificateId, approved, rejected }) => {
                  return (
                    <div key={id} className="p-1 my-3 bg-white border shadow rounded-xl">
                      <div className='my-3 w-96'>{getDegree(id)}</div>
                      <div className="relative bg-white border border-gray-200 rounded-lg shadow h-96 w-96 dark:bg-gray-800 dark:border-gray-700">
                        <div className='absolute z-30 top-3 right-3 hover:cursor-pointer hover:scale-105'>
                          <ImageFull cId={certificateId} />
                        </div>
                        <Image src={`http://25-school.uz/school/api/v1/asset/${certificateId}` ?? ''} alt="Hujjat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
                        {
                          approved || rejected ? "" :
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
                            </div>
                        }
                      </div>
                      {
                        approved ?
                          <h1 className='text-green-500'>Tasdiqlangan</h1> : rejected ?
                            <h1 className='text-red-500'>Rad etilgan</h1> :
                            <h1 className='text-orange-500'>Tasdiqlanmagan</h1>
                      }
                    </div>
                  )
                }) : <Loader />
              }
            </div>
          </div >
          : mode?.includes('subject') ? <div className="space-y-3">
            <div className="flex items-center w-full space-x-2">
              <div className="text-base text-gray-500">
                F.I.SH:
              </div>
              <div className="w-full text-lg font-medium capitalize">
                {teacher?.fullName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-base text-gray-500 whitespace-nowrap">
                Birinchi fan:
              </div>
              <div className="w-full text-lg font-medium">
                <Select onValueChange={(val) => getSelectData(0, val)}>
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
              <div className="text-base text-gray-500 whitespace-nowrap">
                Ikkinchi fan:
              </div>
              <div className="w-full text-lg font-medium">
                <Select onValueChange={(val) => getSelectData(1, val)}>
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
            <div className="flex items-center justify-end">
              {isSaving ?
                <Button disabled={true}>
                  <Loader2 className='w-6 h-6 mr-2' />
                  Saqlanmoqda...
                </Button>
                : <Button onClick={() => addSubjectToTeacher()}>
                  <SolarCheckCircleBroken className='w-6 h-6 mr-2' />
                  Saqlash
                </Button>
              }
            </div>
          </div> : <form onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="flex items-center w-full space-x-2">
                    <div className="text-base text-gray-500">
                      Fan:
                    </div>
                    <div className="w-full text-lg font-medium capitalize">
                      {teacher?.degree}
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
        }
      </DialogContent>
      <div className="w-full p-5">
        <div className="flex items-center py-4">
          <Input
            placeholder="F.I.SH bo`yicha izlash..."
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            className="max-w-sm"
            onChange={(event) => {
              return table.getColumn("fullName")?.setFilterValue(event.target.value)
            }}
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
                      <TableCell key={cell.id} className="py-2">
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