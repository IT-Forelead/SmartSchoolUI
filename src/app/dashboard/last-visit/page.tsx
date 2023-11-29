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
import Loader from "@/components/client/Loader";
import { Dialog } from "@/components/ui/dialog";
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
import { Visit } from "@/models/common.interface";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import Webcam from "react-webcam";
import useWebSocket from "react-use-websocket";

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
    header: "F.I.SH",
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
        className={`py-1 px-3 text-sm uppercase inline-block text-black rounded-full ${
          row.getValue("visitType") === "come_in"
            ? "bg-green-300"
            : "bg-red-300"
        }`}
      >
        {translateVisitType(row.getValue("visitType"))}
      </div>
    ),
  },
];

export default function VisitsPage() {
  const currentUser = useUserInfo();
  const router = useRouter();

  function showCertificates(mode: string, visit: Visit) {
    setVisit(visit);
  }

  const [socketUrl, setSocketUrl] = useState<string>("ws://localhost:8000/ws")
  const [messageHistory, setMessageHistory] = useState([])
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    if (!currentUser?.User?.role?.includes("admin")) {
      router.push("/dashboard/denied");
    }
  }, [currentUser?.User?.role, router]);
  const [visit, setVisit] = useState<Visit | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isError, isLoading, refetch } = useVisitsList();

  let visits = data?.data ?? [];
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

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-5 space-y-2">
          <div className="rounded-lg overflow-hidden w-full h-auto mb-2">
            <Webcam audio={false} mirrored={true} disablePictureInPicture={true}/>
          </div>
          {messageHistory.map((message, idx) => (
            message?.data.includes("visit") ? 
            <div key={idx} className="flex items-center w-full px-4 py-2 space-x-4 border rounded-md">
              <img
                src={`http://localhost:8000/asset/view/${JSON.parse(message?.data)?.data?.assetId}`}
                alt="Visitor picture"
                className="rounded-md h-20 w-20"
              />
              <div className="space-y-1">
                <div className="text-lg font-medium">{message ? JSON.parse(message?.data)?.data?.assetId : ""}</div>
                <div className="text-base">
                {dateFormatter(JSON.parse(message?.data)?.data?.createdAt)}
                </div>
                <div className="inline-block px-8 py-0.5 text-sm uppercase rounded-full bg-green-300 text-center">
                {translateVisitType(JSON.parse(message?.data)?.data?.visitType)}
                </div>
              </div>
            </div> : ""        
          ))}

          {/* <div className="flex items-center w-full px-4 py-2 space-x-4 border rounded-md">
            <div className="bg-yellow-300 rounded-md h-20 w-20"></div>
            <div className="space-y-1">
              <div className="text-lg font-medium">Jumaniyozov Surojiddin</div>
              <div className="text-base">29/11/2023 11:55</div>
              <div className="inline-block px-8 py-0.5 text-sm uppercase rounded-full bg-green-300 text-center">keldi</div>
            </div>
          </div> */}
          
        </div>
        <div className="w-full col-span-2 p-5">
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
        </div>
      </div>
    </Dialog>
  );
}
