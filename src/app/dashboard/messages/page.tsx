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
import * as React from "react";
import { MessageFilter } from "@/models/common.interface";

import { format } from "date-fns";

import Loader from "@/components/client/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMessagesList, useMessagesStats } from "@/hooks/useMessages";
import useUserInfo from "@/hooks/useUserInfo";
import { dateFormatter, translateSMSStatus } from "@/lib/composables";
import { CalendarIcon, Link2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Message } from "@/models/common.interface";
import { useEffect, useState } from "react";
import { paginate } from "@/lib/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/date";

export const columns: ColumnDef<Message>[] = [
  {
    header: "No",
    cell: ({ row }) => <div>{parseInt(row.id, 10) + 1}</div>,
  },
  {
    accessorKey: "to",
    header: "SMS yuborilgan raqam",
    cell: ({ row }) => <div className="uppercase">{row.getValue("to")}</div>,
  },
  {
    accessorKey: "text",
    header: "Xabar matni",
    cell: ({ row }) => (
      <div>
        {(row.getValue("text") as string)?.includes("25-school.uz/link/") ? (
          <a
            href={row.getValue("text")}
            className="flex items-center text-blue-600"
            target="_blank"
          >
            <Link2Icon className="mr-1" />
            {row.getValue("text")}
          </a>
        ) : (
          row.getValue("text")
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "SMS yuborilgan sana",
    cell: ({ row }) => (
      <div className="uppercase">
        {dateFormatter(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      let styleStatus = "bg-gray-600  text-white py-1 rounded-full text-center";
      if (status === "Sent") {
        styleStatus = "bg-blue-600 text-white py-1 rounded-full text-center";
      } else if (status === "Delivered") {
        styleStatus = "bg-green-600 text-white py-1 rounded-full text-center";
      } else if (status === "NotDelivered") {
        styleStatus = "bg-yellow-600 text-white py-1 rounded-full text-center";
      } else if (status === "Failed") {
        styleStatus = "bg-red-600 text-white py-1 rounded-full text-center";
      }

      return (
        <div className={`lowercase ${styleStatus}`}>
          {translateSMSStatus(status)}
        </div>
      );
    },
  },
];

export default function MessagesPage() {
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<MessageFilter>({});
  const { data, isError, isLoading, refetch } = useMessagesList(filter);
  const d = data?.data?.messages ?? [];

  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [phone, setPhone] = useState<string>("");

  const handleSubmit = () => {
    const data = {
      from: dateStart ? format(dateStart, "yyyy-MM-dd") : undefined,
      to: dateEnd ? format(dateEnd, "yyyy-MM-dd") : undefined,
      phone: phone == "" ? undefined : phone,
      page: 1,
    };
    setFilter(data);
  };

  const stats = useMessagesStats().data?.data;
  const [pagesCount, setPagesCount] = useState<number>(
    data?.data.totalPages ?? 1,
  );
  useEffect(() => {
    if (currentPage <= 0) {
      setCurrentPage(1);
    } else if (currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    } else {
      setCurrentPage(currentPage);
      setFilter({
        ...filter,
        page: currentPage,
      });
    }
  }, [currentPage]);

  if (data?.data.totalPages != pagesCount) {
    if (typeof data?.data.totalPages == "number") {
      setPagesCount(data?.data.totalPages ?? 1);
    }
  }

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
  });
  table.getState().pagination.pageSize = 40;
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-5">
      <div>
        <div className="flex w-full items-center justify-between space-x-1 py-4">
          <div className="flex w-full items-center justify-start space-x-5 py-4">
            <Input
              placeholder="Raqam bo`yicha izlash..."
              className="w-54 max-w-sm"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateStart && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateStart ? humanize(dateStart) : <span>Sana tanlash</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateStart}
                  onSelect={setDateStart}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateEnd && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateEnd ? humanize(dateEnd) : <span>Sana tanlash</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateEnd}
                  onSelect={setDateEnd}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleSubmit}>Qidirish</Button>
        </div>
      </div>

      <div className="flex">
        <div className="flex items-center justify-start space-x-2 py-4">
          <div className="flex-1">
            <div className="text-muted-foreground flex items-start space-x-2 text-sm dark:text-slate-400 ">
              <div className="rounded-full pt-2 text-white">Jami</div>
              <div className="pt-2 text-white">:</div>
              <div className="mr-2 mt-2 font-bold text-gray-300">
                {stats?.total}
              </div>
              <Separator orientation="vertical" />
              <div className="upparcase rounded-full bg-green-600 p-2 text-center text-white">
                {translateSMSStatus("Delivered")}
              </div>
              <div className="pt-2 text-white">:</div>
              <div className="mt-2 font-bold text-gray-300">
                {stats?.delivered}
              </div>
              <Separator orientation="vertical" />
              <div className="rounded-full  bg-blue-600 p-2 text-center text-white">
                {translateSMSStatus("Sent")}
              </div>
              <div className="pt-2 text-white">:</div>
              <div className="mt-2 font-bold text-gray-300">{stats?.sent}</div>
              <Separator orientation="vertical" />
              <div className="rounded-full bg-yellow-600 p-2 text-center text-white">
                {translateSMSStatus("NotDelivered")}
              </div>
              <div className="pt-2 text-white">:</div>
              <div className="mt-2 font-bold text-gray-300">
                {stats?.notDelivered}
              </div>
              <Separator orientation="vertical" />

              <div className="rounded-full bg-red-600 p-2 text-center text-white ">
                {translateSMSStatus("Failed")}
              </div>
              <div className="pt-2 text-white">:</div>
              <div className="mt-2 font-bold text-gray-300">
                {stats?.failed}
              </div>
              <Separator orientation="vertical" />

              <div className="rounded-full bg-gray-600 p-2 text-center text-white">
                {translateSMSStatus("Undefined")}{" "}
              </div>
              <div className="pt-2 text-white">:</div>
              <div className="pt-2 font-bold text-gray-300">
                {(stats?.undefined ?? 0) + (stats?.transmitted ?? 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pb-0">
          <div className="space-x-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>
                {paginate(currentPage, pagesCount).map((page) => {
                  return (
                    <PaginationItem key={page}>
                      {page == 0 ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={page == currentPage}
                          onClick={() => {
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border dark:border-slate-600">
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

      <div className="flex items-center justify-end pt-10">
        <div className="space-x-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>
              {paginate(currentPage, pagesCount).map((page) => {
                return (
                  <PaginationItem key={page}>
                    {page == 0 ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={page == currentPage}
                        onClick={() => {
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
