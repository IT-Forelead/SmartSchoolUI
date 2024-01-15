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
  Check,
  ChevronDown,
  ChevronsUpDown,
  Download,
} from "lucide-react";
import * as React from "react";
import ViewVisitorPicture from "@/components/client/visits/ViewVisitorPicture";
import Loader from "@/components/client/Loader";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useVisitsList } from "@/hooks/useVisits";
import useUserInfo from "@/hooks/useUserInfo";
import { Group, Visit, VisitFilter } from "@/models/common.interface";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import { downloadCsv } from "@/lib/csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGroupsList } from "@/hooks/useGroups";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SolarUsersGroupRoundedBroken } from "@/icons/TeacherIcon";
import { SolarUserHandsOutline } from "@/icons/StudentsIcon";
import { paginate } from "@/lib/pagination";
import moment from "moment";

export const columns = (
  setVisit: Dispatch<SetStateAction<Visit | null>>,
  showCertificates: any,
): ColumnDef<Visit, any>[] => [
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
    accessorKey: "createdAt",
    header: "Tashrif vaqti",
    cell: ({ row }) => (
      <div className="capitalize">
        {dateFormatter(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "visitType",
    header: "Tashrif turi",
    cell: ({ row }) => (
      <div
        className={`inline-block rounded-full px-3 py-1 text-base text-white ${
          row.getValue("visitType") === "come_in"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {translateVisitType(row.getValue("visitType"))}
      </div>
    ),
  },
  {
    accessorKey: "assetId",
    header: "Asset Id",
    cell: ({ row }) => (
      <div className="flex items-center">
        <ViewVisitorPicture assetId={row.getValue("assetId")} />
      </div>
    ),
  },
  {
    accessorKey: "groupName",
    header: "Group",
    cell: ({ row }) => {
      const groupLevel = row.original.groupLevel;
      const name = row.original.groupName;
      return <div>{groupLevel ? `${groupLevel}-${name}` : "Teacher"}</div>;
    },
  },
];

export default function VisitsPage() {
  const currentUser = useUserInfo();
  const router = useRouter();

  function showCertificates(mode: string, visit: Visit) {
    setVisit(visit);
  }

  const [from, setStartDate] = useState<Date | any>();
  const [to, setEndDate] = useState<Date | any>();

  useEffect(() => {
    if (!currentUser?.User?.role?.includes("admin")) {
      router.push("/dashboard/profile");
    }
  }, [currentUser?.User?.role, router]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     refetch();
  //   }, 100000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const handleSubmit = () => {
    setVisitFilter({
      groupName: selectedGroup?.name,
      groupLevel: selectedGroup?.level,
      from: from ? moment(from).format("yyyy-MM-DD") : undefined,
      to: to ? moment(to).format("yyyy-MM-DD") : undefined,
    });
    setCurrentPage(1);
    // refetch()
  };

  const groupResponse = useGroupsList();
  const groups = groupResponse?.data?.data || [];

  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [openGroup, setOpenGroup] = useState(false);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [visitFilter, setVisitFilter] = useState<VisitFilter>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isError, isLoading, refetch } = useVisitsList(visitFilter);
  const visits = data?.data?.visits ?? [];
  const [pagesCount, setPagesCount] = useState<number>(
    data?.data.totalPages ?? 1,
  );

  useEffect(() => {
    if (currentPage <= 0) setCurrentPage(1);
    else if (currentPage > pagesCount) setCurrentPage(pagesCount);
    else setVisitFilter({ ...visitFilter, page: currentPage });
  }, [currentPage]);

  if (data?.data.totalPages != pagesCount) {
    if (typeof data?.data.totalPages == "number") {
      setPagesCount(data?.data.totalPages ?? 1);
    }
  }

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
  });
  table.getState().pagination.pageSize = 40;

  if (isLoading) {
    return !currentUser?.User?.role?.includes("admin") ? "" : <Loader />;
  }

  return !currentUser?.User?.role?.includes("admin") ? (
    ""
  ) : (
    <div className="w-full p-5">
      <div>
        <div className="flex w-full items-center justify-between space-x-1 py-4">
          <div className="flex w-full items-center justify-start space-x-5 py-4">
            <Input
              placeholder="F.I.SH bo`yicha izlash..."
              value={
                (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
              }
              className="w-54 max-w-sm"
              onChange={(event) => {
                return table
                  .getColumn("fullName")
                  ?.setFilterValue(event.target.value);
              }}
            />

            <DatePicker
              className="flex h-9 w-36 rounded-md border"
              selected={from}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={from}
              endDate={to}
              showIcon={true}
              placeholderText={"dd/MM/yyyy"}
            />
            <DatePicker
              className="flex h-9 w-36 rounded-md border"
              selected={to}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={from}
              endDate={to}
              minDate={from}
              showIcon={true}
              placeholderText={"dd/MM/yyyy"}
            />

            <div className="flex space-x-1">
              <Popover open={openGroup} onOpenChange={setOpenGroup}>
                <p className="flex items-center text-base font-semibold text-gray-500">
                  Guruh:
                </p>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openGroup}
                    className="w-full justify-between"
                  >
                    {selectedGroup
                      ? `${selectedGroup?.level}-${selectedGroup?.name}`
                      : "Guruh tanlash..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Izlash..." />
                    <CommandEmpty>Guruh topilmadi.</CommandEmpty>
                    <CommandGroup className="max-h-80 overflow-auto">
                      {groups
                        ?.sort((a, b) => a.level - b.level)
                        ?.map((group) => (
                          <CommandItem
                            key={group?.id}
                            onSelect={() => {
                              selectedGroup == group
                                ? setSelectedGroup(undefined)
                                : setSelectedGroup(group);
                              setOpenGroup(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedGroup?.id === group?.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {`${group?.level}-${group?.name}`}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button className="ml-auto" onClick={handleSubmit}>
              Qidirish
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Download className="mr-2 h-5 w-5" />
                Export <ChevronDown className="ml-4 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="divide-y">
              <DropdownMenuItem className="capitalize">
                <div className="flex w-fit items-center space-x-3">
                  <SolarUsersGroupRoundedBroken className="h-5 w-5" />
                  <span
                    onClick={() =>
                      downloadCsv({ ...visitFilter, type: "teachers" })
                    }
                  >
                    Export Teachers
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="capitalize">
                <div className="flex w-fit items-center space-x-3">
                  <SolarUserHandsOutline className="h-5 w-5" />
                  <span
                    onClick={() =>
                      downloadCsv({ ...visitFilter, type: "students" })
                    }
                  >
                    Export Students
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
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
                    <TableCell key={cell.id} className="py-2">
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
