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
import * as React from "react"

import Loader from "@/components/client/Loader"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMessagesList } from "@/hooks/useMessages"
import useUserInfo from "@/hooks/useUserInfo"
import { dateFormatter, translateSMSStatus } from "@/lib/composables"
import { Link2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Message } from "@/models/common.interface"
import { useEffect, useState } from "react"

export const columns: ColumnDef<Message>[] = [
  {
    header: "No",
    cell: ({ row }) => (
      <div>{parseInt(row.id, 10) + 1}</div>
    ),
  },
  {
    accessorKey: "to",
    header: "SMS yuborilgan raqam",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('to')}</div>
    ),
  },
  {
    accessorKey: "text",
    header: 'Xabar matni',
    cell: ({ row }) => (
      <div>{(row.getValue('text') as string)?.includes('25-school.uz/link/') ?
        <a href={row.getValue('text')} className="flex items-center text-blue-600" target="_blank">
          <Link2Icon className="mr-1" />{row.getValue('text')}
        </a> : row.getValue('text')}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "SMS yuborilgan sana",
    cell: ({ row }) => (
      <div className="uppercase">{dateFormatter(row.getValue('createdAt'))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: 'Status',
    cell: ({ row }) => (
      <div className="lowercase">{translateSMSStatus(row.getValue('status'))}</div>
    ),
  }
]

export default function MessagesPage() {
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

  const { data, isError, isLoading } = useMessagesList();

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

