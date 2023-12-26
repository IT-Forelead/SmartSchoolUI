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
import { ArrowUpDown, Check, ChevronDown, ChevronsUpDown, Command } from "lucide-react";
import * as React from "react";
import ViewVisitorPicture from "@/components/client/visits/ViewVisitorPicture";
import Loader from "@/components/client/Loader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Group, Visit, VisitFilter} from "@/models/common.interface";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import { downloadCsv } from "@/lib/csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { log } from "console";
import { useGroupsList } from "@/hooks/useGroups";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
export const columns = (
  setVisit: Dispatch<SetStateAction<Visit | null>>,
  showCertificates: any
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
          <ArrowUpDown className="w-4 h-4 ml-2" />
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
        className={`py-1 px-3 text-base inline-block text-white rounded-full ${
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
    // setSubjectIdsList([])
    // setMode(mode)
    setVisit(visit);
  }

  const [groupLevel, setLevelValue] = useState();

  const handleLevelChange = (event: any) => {
    setLevelValue(event.target.value);
  };

  const [groupName, setGroupValue] = useState("");

  const handleGroupChange = (event: any) => {
    setGroupValue(event.target.value);
  };
  const [from, setStartDate] = useState<Date | any>();
  const [to, setEndDate] = useState<Date | any>();

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const levelOptions = [
    { value: "", label: "Sinf", disabled: true },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
  ];

  const groupOptions = [
    { value: "", label: "Guruh", disabled: true },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];

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
    setVisitFilter(
      {
        groupName: groupName,
        groupLevel: groupLevel,
        from: from,
        to: to,
      }
    );
  };




  const groupResponse = useGroupsList();
  const groups = groupResponse?.data?.data || []

  const [selectedGroup, setSelectedGroup] = useState<Group>()
  const [openGroup, setOpenGroup] = useState(false)
  const [visit, setVisit] = useState<Visit | null>(null);
  const [visitFilter, setVisitFilter] = useState<VisitFilter>({});

  const [open, setOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isError, isLoading, refetch } = useVisitsList(visitFilter);
  const visits = data?.data?.visits ?? [];

  
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
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full p-5">
        <div>
          <div className="flex space-x-1 w-full justify-between items-center py-4">
            <Input
              placeholder="F.I.SH bo`yicha izlash..."
              value={
                (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
              }
              className="max-w-sm w-54"
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
                                        <p className="text-base font-semibold text-gray-500">Guruh:</p>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openGroup}
                                                className="justify-between w-full"
                                            >
                                                {selectedGroup
                                                    ? `${selectedGroup?.level}-${selectedGroup?.name}`
                                                    : "Guruh tanlash..."}
                                                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Izlash..."/>
                                                <CommandEmpty>Guruh topilmadi.</CommandEmpty>
                                                <CommandGroup className="overflow-auto max-h-80">
                                                    {groups?.sort((a, b) => a.level - b.level)?.map((group) => (
                                                        <CommandItem
                                                            key={group?.id}
                                                            onSelect={() => {
                                                                setSelectedGroup(group)
                                                                setOpenGroup(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedGroup?.id === group?.id ? "opacity-100" : "opacity-0"
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
            {/* <div className="flex border items-center bg-white px-4 h-9 rounded-md">
                <select
                className="bg-white"
                value={groupLevel}
                onChange={handleLevelChange}
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex border items-center bg-white px-4 h-9 rounded-md">
                <select
                  className="bg-white "
                value={groupName}
                onChange={handleGroupChange}
              >
                {groupOptions.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            </div> */}
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
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="ml-auto" onClick={handleSubmit}>Qidirish </Button>
          </div>
          <div className="flex space-x-3 justify-end">
            <Button className="ml-3" onClick={() => downloadCsv(table)}>
              Export Teachers
            </Button>
            <Button className="ml-3" onClick={() => downloadCsv(table)}>
              Export Students
            </Button>
          </div>
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
                          cell.getContext()
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
  );
}
