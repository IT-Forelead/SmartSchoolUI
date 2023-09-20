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
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"

import Loader from "@/components/client/Loader"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGroupsList } from "@/hooks/useGroups"
import { useSubjectsList } from "@/hooks/useSubjects"
import { useSubstitutionList, useTeachersList } from "@/hooks/useTeachers"
import useUserInfo from "@/hooks/useUserInfo"
import { translateEnToUzbWeekday } from "@/lib/composables"
import { Substitution } from "@/models/common.interface"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const columns = (
  getSubject: (sId: string) => any,
  getTeacher: (tId: string) => any,
  getGroup: (gId: string) => any,
): ColumnDef<Substitution>[] => [
    {
      header: "No",
      cell: ({ row }) => (
        <div>{parseInt(row.id, 10) + 1}</div>
      ),
    },
    {
      accessorKey: "from",
      header: "Kimdan",
      cell: ({ row }) => (
        <div className="uppercase">{getTeacher(row.getValue('from'))?.fullName}</div>
      ),
    },
    {
      accessorKey: "to",
      header: "Kimga",
      cell: ({ row }) => (
        <div className="uppercase">{getTeacher(row.getValue('to'))?.fullName}</div>
      ),
    },
    {
      accessorKey: "subjectId",
      header: 'Fan nomi',
      cell: ({ row }) => (
        <div className="uppercase">{getSubject(row.getValue('subjectId'))?.name}</div>
      ),
    },
    {
      accessorKey: "groupId",
      header: 'Sinf',
      cell: ({ row }) => (
        <div className="uppercase">{`${getGroup(row.getValue('groupId'))?.level}-${getGroup(row.getValue('groupId'))?.name}`}</div>
      ),
    },
    {
      accessorKey: "weekday",
      header: "Hafta kuni",
      cell: ({ row }) => (
        <div className="uppercase">{translateEnToUzbWeekday(row.getValue('weekday'))}</div>
      ),
    },
    {
      accessorKey: "moment",
      header: "Dars joylashuvi",
      cell: ({ row }) => (
        <div className="uppercase">{`${row.getValue('moment')}-para`}</div>
      ),
    },
    {
      id: "actions",
      header: "Amallar",
      enableHiding: false,
      cell: ({ row }) => {
        const room = row.original

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
              <DropdownMenuItem className="text-blue-600">
                <PencilIcon className="w-4 h-4 mr-1" />
                Tahrirlash
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

export default function SubstitutionPage() {
  const currentUser = useUserInfo()
  const router = useRouter()
  useEffect(() => {
    if (!currentUser?.role?.includes('admin')) {
      router.push('/dashboard/denied')
    }
  }, [currentUser?.role, router])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const subjectsResponse = useSubjectsList();
  const subjects = subjectsResponse?.data?.data

  function getSubject(sId: string) {
    return subjects?.find((subject) => subject.id === sId)
  }

  const teacherResponse = useTeachersList();
  const teachers = teacherResponse?.data?.data

  function getTeacher(tId: string) {
    return teachers?.find((teacher) => teacher.id === tId)
  }

  const groupResponse = useGroupsList();
  const groups = groupResponse?.data?.data

  function getGroup(gId: string) {
    return groups?.find((group) => group.id === gId)
  }

  const { data, isError, isLoading } = useSubstitutionList();

  let substitutions = data?.data ?? []
  const table = useReactTable({
    data: substitutions,
    columns: columns(getSubject, getTeacher, getGroup),
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

  return (
    <div className="w-full p-5">
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
                  colSpan={columns.length}
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
  )
}
