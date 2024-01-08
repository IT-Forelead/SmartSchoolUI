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
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";

import Loader from "@/components/client/Loader";
import { ChangeWorkload } from "@/components/client/teachers/ChangeWorkload";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeachersList, useWorkloadHistoryList } from "@/hooks/useTeachers";
import useUserInfo from "@/hooks/useUserInfo";
import { SolarDownloadSquareBroken } from "@/icons/DownloadIcon";
import { Teacher, WorkloadHistory } from "@/models/common.interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getTeacherData(list: Teacher[], id: string) {
  return list.find((teacher) => teacher?.id === id)?.fullName;
}

function downloadFile(fileName: string) {
  const downloadLink = document.createElement("a");
  downloadLink.href = `http://25-school.uz/school/api/v1/asset/${fileName}`;
  downloadLink.download = fileName;
  downloadLink.target = "_blank";

  // Append the link to the DOM (this is required for the download to work in some browsers)
  document.body.appendChild(downloadLink);

  // Click the link to start the download
  downloadLink.click();

  // Remove the link (it's not needed anymore)
  document.body.removeChild(downloadLink);
}

export const columns = (teachers: Teacher[]): ColumnDef<WorkloadHistory>[] => [
  {
    header: "No",
    cell: ({ row }) => <div>{parseInt(row.id, 10) + 1}</div>,
  },
  {
    accessorKey: "from",
    header: "Kimdan",
    cell: ({ row }) => (
      <div className="uppercase">
        {getTeacherData(teachers, row.getValue("from"))}
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: "Kimga",
    cell: ({ row }) => (
      <div className="uppercase">
        {getTeacherData(teachers, row.getValue("to"))}
      </div>
    ),
  },
  {
    accessorKey: "workload",
    header: "Dars soati",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("workload")}</div>
    ),
  },
  {
    accessorKey: "reasonDocId",
    header: "Asos hujjat",
    cell: ({ row }) => (
      <div className="flex items-center uppercase">
        {row.getValue("reasonDocId")}
        {
          <SolarDownloadSquareBroken
            onClick={() => downloadFile(row.getValue("reasonDocId"))}
            className="w-5 h-5 ml-3 text-blue-600 hover:cursor-pointer hover:scale-105"
          />
        }
      </div>
    ),
  },
  {
    id: "actions",
    header: "Amallar",
    enableHiding: false,
    cell: ({ row }) => {
      const hours = row.original;

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
      );
    },
  },
];

export default function TeacherWorkloadPage() {
  const currentUser = useUserInfo();
  const router = useRouter();
  useEffect(() => {
    if (!currentUser?.User?.role?.includes("admin")) {
      router.push("/dashboard/denied");
    }
  }, [currentUser?.User?.role, router]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isError, isLoading } = useWorkloadHistoryList();
  const teacherResponse = useTeachersList();

  const teachers = teacherResponse?.data?.data || [];

  let d = data?.data ?? [];
  const table = useReactTable({
    data: d,
    columns: columns(teachers),
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-end w-full">
        <ChangeWorkload />
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
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={6} className="h-24 text-center">
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
  );
}
