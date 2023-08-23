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
import { ArrowUpDown, ChevronDown, CopyIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
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
import { useEditTeacher, useTeachersList } from "@/hooks/useTeachers"
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
  workload: number
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

export const columns = (setTeacher: React.Dispatch<React.SetStateAction<Teacher | null>>): ColumnDef<Teacher, any>[] => [
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
    id: "actions",
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
            <DropdownMenuItem className="text-blue-600">
              <DialogTrigger className="flex items-center space-x-2" onClick={() => setTeacher(teacher)}>
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
  React.useEffect(() => {
    if (currentUser?.role !== 'admin') {
      router.push('/dashboard/denied')
    }
  }, [currentUser?.role, router])
  const [teacher, setTeacher] = React.useState<Teacher | null>(null)
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
    columns: columns(setTeacher),
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
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>O`qituvchi profili</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {/* <div className="flex items-center space-x-2">
                  <div className="text-base text-gray-500 whitespace-nowrap">
                    Dars soati:
                  </div>
                  <div className="w-full text-lg font-medium capitalize">
                    <Input type="number" className="w-full" {...register("workload", { required: false })} />
                  </div>
                </div> */}
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
      </DialogContent>
      <div className="w-full p-5">
        <div className="flex items-center py-4">
          <Input
            placeholder="Fan nomi bo`yicha izlash..."
            value={(table.getColumn("subjectName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              console.log(table.getColumn("subjectName"))

              return table.getColumn("subjectName")?.setFilterValue(event.target.value)
            }
            }
            className="max-w-sm"
          />
          <Input
            placeholder="F.I.SH bo`yicha izlash..."
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              console.log(table.getColumn("fullName"))

              return table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            }
            className="max-w-sm ml-3"
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