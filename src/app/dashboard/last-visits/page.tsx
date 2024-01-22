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
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import Webcam from "react-webcam";

import Loader from "@/components/client/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUserInfo from "@/hooks/useUserInfo";
import { updateVisit, useVisitsList } from "@/hooks/useVisits";
import { SolarQrCodeBroken } from "@/icons/QrCodeIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import { LastVisit, Visit } from "@/models/common.interface";

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
    header: "F.I.SH",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tashrif vaqti",
    cell: ({ row }) => <div>{dateFormatter(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "visitType",
    header: "Tashrif turi",
    cell: ({ row }) => (
      <div
        className={`inline-block rounded-full px-3 py-1 text-sm capitalize text-black ${
          row.getValue("visitType") === "come_in"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {translateVisitType(row.getValue("visitType"))}
      </div>
    ),
  },
];

export default function LastVisitsPage() {
  const currentUser = useUserInfo();
  const router = useRouter();

  const hasAdminOrVisitMonitoringRole =
    currentUser?.User?.role?.includes("admin") ||
    currentUser?.User?.role?.includes("visit_monitoring");

  useEffect(() => {
    // If the user doesn't have admin or visit-monitoring role, redirect to denied page
    if (!hasAdminOrVisitMonitoringRole) {
      router.push("/dashboard/denied");
    }
  }, [hasAdminOrVisitMonitoringRole, router]);

  function showCertificates(mode: string, visit: Visit) {
    setVisit(visit);
  }

  const webcamRef = useRef(null);

  const [visitHistoryInWebSocket, setVisitHistoryInWebSocket] = useState<
    LastVisit[]
  >([]);
  const { lastJsonMessage } = useWebSocket<LastVisit>(
    process.env.NEXT_PUBLIC_WS_URI ?? "",
  );

  function makeBlob(base64String: string) {
    const [contentType, dataPart] = base64String.split(";base64,");
    // Convert base64 to binary
    const binaryString = atob(dataPart);

    // Create a Uint8Array from the binary string
    const dataArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      dataArray[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob with the data and specify the MIME type (e.g., image/png)
    return new Blob([dataArray], { type: contentType.replace(/^data:/, "") });
  }

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setVisitHistoryInWebSocket((prev) => prev.concat(lastJsonMessage));
      if (
        lastJsonMessage?.kind === "visit" &&
        webcamRef.current &&
        webcamRef.current.stream
      ) {
        const imageSrc = webcamRef.current.getScreenshot();
        const form = new FormData();
        form.append("file", makeBlob(imageSrc));
        updateVisit(lastJsonMessage?.data?.id, form);
      } else {
        console.log("webcam is not working...");
      }
    }
  }, [lastJsonMessage, setVisitHistoryInWebSocket]);

  const [visit, setVisit] = useState<Visit | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading } = useVisitsList({ perPage: 10 });

  let visits = data?.data.visits ?? [];
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
    <div className="w-full p-5">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center space-y-2 p-5">
          <div className="mb-2 h-auto w-full overflow-hidden rounded-lg">
            <Webcam
              audio={false}
              mirrored={true}
              disablePictureInPicture={true}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              forceScreenshotSourceSize={true}
              width={1280}
            />
          </div>
          {visitHistoryInWebSocket.slice(-3).map((message, idx) =>
            message?.kind === "visit" ? (
              <div
                key={idx}
                className="flex w-full items-center space-x-4 rounded-md border px-4 py-2 dark:border-slate-600"
              >
                <div className="rounded-lg border p-1.5 dark:border-slate-600">
                  <SolarUserBroken className="h-20 w-20 text-gray-500" />
                </div>
                <div className="space-x-1 space-y-1">
                  <div className="text-lg font-medium">
                    {message?.data?.fullName}
                  </div>
                  <div className="text-base">
                    {dateFormatter(message?.data?.createdAt)}
                  </div>
                  <div
                    className={`inline-block rounded-full px-4 py-0.5 text-sm capitalize ${
                      message?.data?.label === "teacher"
                        ? "bg-blue-600 text-white"
                        : message?.data?.label === "student"
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-600 text-white"
                    } text-center`}
                  >
                    {message?.data?.label === "teacher"
                      ? "O'qituvchi"
                      : message?.data?.label === "student"
                        ? "O'quvchi"
                        : "Hodim"}
                  </div>
                  <div
                    className={`inline-block rounded-full px-8 py-0.5 text-sm capitalize ${
                      message?.data?.visitType === "come_in"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    } text-center`}
                  >
                    {translateVisitType(message?.data?.visitType)}
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex w-full items-center space-x-2 rounded-md border px-4 py-2 dark:border-slate-600"
              >
                <div className="flex items-center justify-center rounded-md bg-gray-200 p-2">
                  <SolarQrCodeBroken className="h-8 w-8" />
                </div>
                <div className="text-lg font-medium">
                  Ushbu Qr kodga foydalanuvchi biriktirlmagan!
                </div>
              </div>
            ),
          )}
        </div>
        <div className="col-span-2 w-full p-5">
          <div className="rounded-md border dark:border-slate-600">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="dark:text-slate-400"
                        >
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
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center dark:text-slate-300"
                    >
                      Hech nima topilmadi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
