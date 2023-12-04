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
import { updateVisit, useVisitsList } from "@/hooks/useVisits";
import useUserInfo from "@/hooks/useUserInfo";
import { Visit } from "@/models/common.interface";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import Webcam from "react-webcam";
import useWebSocket from "react-use-websocket";
import { SolarQrCodeBroken } from '@/icons/QrCodeIcon'

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

  const webcamRef = React.useRef(null)
  const [socketUrl, setSocketUrl] = useState<string>("wss://25-school.uz/school/api/v1/ws")
  const [visitHistoryInWebSocket, setVisitHistoryInWebSocket] = useState([])
  const { lastJsonMessage } = useWebSocket(socketUrl)

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setVisitHistoryInWebSocket((prev) => prev.concat(lastJsonMessage));
      if (lastJsonMessage?.kind === "visit") {
        const imageSrc = webcamRef.current.getScreenshot()
        updateVisit({
          id: lastJsonMessage?.data?.id ?? "",
          filename: imageSrc ?? ""
        })
      }
    }
  }, [lastJsonMessage, setVisitHistoryInWebSocket]);

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
            <Webcam 
              audio={false} 
              mirrored={true} 
              disablePictureInPicture={true}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
            />
          </div>
          {visitHistoryInWebSocket.slice(-3).map((message, idx) => (
            message?.kind === "visit" ? 
            <div key={idx} className="flex items-center w-full px-4 py-2 space-x-4 border rounded-md">
              <img
                src={`http://localhost:8000/asset/view/${message?.data?.assetId}`}
                alt="Visitor picture"
                className="rounded-md h-20 w-20"
              />
              <div className="space-y-1">
                <div className="text-lg font-medium">{message?.data?.assetId}</div>
                <div className="text-base">
                  {dateFormatter(message?.data?.createdAt)}
                </div>
                <div className="inline-block px-8 py-0.5 text-sm uppercase rounded-full bg-green-300 text-center">
                  {translateVisitType(message?.data?.visitType)}
                </div>
              </div>
            </div> : <div className="flex items-center w-full px-4 py-2 space-x-2 border rounded-md">
              <div className="flex items-center justify-center bg-gray-200 rounded-md p-2">
                <SolarQrCodeBroken className="w-8 h-8" />
              </div>
              <div className="text-lg font-medium">Ushbu Qr kodga foydalanuvchi biriktirlmagan!</div>
            </div>
          ))}
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
