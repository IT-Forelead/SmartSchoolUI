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
import { ArrowUpDown, ChevronDown } from "lucide-react"
import * as React from "react"
import ViewVisitorPicture from "@/components/client/visits/ViewVisitorPicture";
import Loader from "@/components/client/Loader"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { useVisitsList } from "@/hooks/useVisits"
import useUserInfo from "@/hooks/useUserInfo"
import { Visit } from "@/models/common.interface"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { dateFormatter, translateVisitType} from "@/lib/composables"

export const columns = (setVisit: Dispatch<SetStateAction<Visit | null>>, showCertificates: any): ColumnDef<Visit, any>[] => [
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
    accessorKey: "createdAt",
    header: 'Tashrif vaqti',
    cell: ({ row }) => (
      <div className="capitalize">{dateFormatter(row.getValue('createdAt'))}</div>
    ),
  },
  {
    accessorKey: "visitType",
    header: 'Tashrif turi',
    cell: ({ row }) => (
      <div className={`py-1 px-3 text-base inline-block text-white rounded-full ${row.getValue('visitType') === 'come_in' ? "bg-green-600" : 'bg-red-600'}`}>{translateVisitType(row.getValue('visitType'))}</div>
    ),
  },
  {
    accessorKey: "assetId",
    header: 'Asset Id',
    cell: ({ row }) => (
        <div className="flex items-center">
            <ViewVisitorPicture  assetId={row.getValue('assetId')}/>
        </div>
    ),
  },
]

export default function VisitsPage() {
  const currentUser = useUserInfo()
  const router = useRouter()

  function showCertificates(mode: string, visit: Visit) {
    // setSubjectIdsList([])
    // setMode(mode)
    setVisit(visit)
  }

  useEffect(() => {
    if (!currentUser?.User?.role?.includes('admin')) {
      router.push('/dashboard/profile')
    }
  }, [currentUser?.User?.role, router])
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch()
    }, 100000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
    
  const [visit, setVisit] = useState<Visit | null>(null)

  const [open, setOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { data, isError, isLoading, refetch } = useVisitsList();
  const visits = data?.data ?? []
  const table = useReactTable({
    data: visits,
    columns: columns(setVisit, showCertificates),
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
    <Dialog open={open} onOpenChange={setOpen}>
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