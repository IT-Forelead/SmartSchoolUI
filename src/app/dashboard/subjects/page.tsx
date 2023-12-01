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
import { ArrowUpDown, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
import * as React from "react"

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
import { useSubjectsList } from "@/hooks/useSubjects"
import useUserInfo from "@/hooks/useUserInfo"
import { useRouter } from "next/navigation"
import { Subject } from "@/models/common.interface"
import { useEffect, useState } from "react"

export const columns: ColumnDef<Subject>[] = [
  {
    header: "No",
    cell: ({ row }) => (
      <div>{parseInt(row.id, 10) + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fan nomi
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: "category",
    header: 'Kategoriyasi',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('category')}</div>
    ),
  },
  {
    accessorKey: "hourForBeginner",
    header: 'Boshlang`ichlar uchun (dars soati)',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('hourForBeginner')}</div>
    ),
  },
  {
    accessorKey: "hourForHigher",
    header: 'Kattalar uchun (dars soati)',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('hourForHigher')}</div>
    ),
  },
  {
    header: 'Jami',
    cell: ({ row }) => (
      <div className="capitalize">{parseInt(row.getValue('hourForHigher')) + parseInt(row.getValue('hourForBeginner')) || 0}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subject = row.original

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

export default function SubjectsPage() {
  const currentUser = useUserInfo()
  const router = useRouter()
  useEffect(() => {
    if (!currentUser?.User?.role?.includes('admin')) {
      router.push('/dashboard/denied')
    }
  }, [currentUser?.User?.role, router])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { data, isLoading } = useSubjectsList();

  let d = data?.data ?? []
  const table = useReactTable({
    data: d,
    columns: columns,
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
  table.getState().pagination.pageSize = 40
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
