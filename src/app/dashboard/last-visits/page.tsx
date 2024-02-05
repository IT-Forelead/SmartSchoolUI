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
import { useVisitCreate, useVisitsList } from "@/hooks/useVisits";
import { SolarQrCodeBroken } from "@/icons/QrCodeIcon";
import { SolarUserBroken } from "@/icons/UserIcon";
import { dateFormatter, translateVisitType } from "@/lib/composables";
import { Visit, VisitInfo } from "@/models/common.interface";
import { getKeyPresses } from "@/lib/keypresses";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [isCameraAllowed, setCameraAllowed] = useState<boolean>(false);

  const [visitHistory, setVisitHistory] = useState<VisitInfo[]>([]);

  const { mutate: visitCreate } = useVisitCreate((data) => {
    setVisitHistory([data.data, ...visitHistory.slice(0, 2)]);
  });

  const [UUID, setUUID] = useState<string>("");

  function makeBlob(base64String: string): Blob {
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

  if (navigator.mediaDevices)
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((value) => setCameraAllowed(value.active));

  const handleKeyPress = getKeyPresses(setUUID);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => window.removeEventListener("keyup", handleKeyPress);
  }, []);

  useEffect(() => {
    if (UUID.length != 36) return;
    if (webcamRef.current == null) return;
    const imageSrc = webcamRef.current.getScreenshot();
    const form = new FormData();
    form.append("file", makeBlob(imageSrc));
    form.append("qrcode", UUID);
    visitCreate(form);
    setUUID("");
  }, [UUID]);

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
            <AspectRatio ratio={4 / 3} className="w-full">
              {isCameraAllowed ? (
                <Webcam
                  audio={false}
                  mirrored={true}
                  disablePictureInPicture={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1}
                  forceScreenshotSourceSize={true}
                  height={480}
                  width={640}
                  videoConstraints={{ height: 480, width: 640 }}
                />
              ) : (
                <Skeleton className="h-full"></Skeleton>
              )}
            </AspectRatio>
          </div>
          <div className="flex w-full flex-col gap-y-2">
            {visitHistory.map((visit, idx) =>
              visit !== null ? (
                <div
                  key={idx}
                  className="flex w-full items-center space-x-4 rounded-md border px-4 py-2 dark:border-slate-600"
                >
                  <div className="rounded-lg border p-1.5 dark:border-slate-600">
                    <SolarUserBroken className="h-20 w-20 text-gray-500" />
                  </div>
                  <div className="space-x-1 space-y-1">
                    <div className="text-lg font-medium">{visit.fullName}</div>
                    <div className="text-base">
                      {dateFormatter(visit.createdAt)}
                    </div>
                    <div
                      className={`inline-block rounded-full px-4 py-0.5 text-sm capitalize ${
                        visit.label === "teacher"
                          ? "bg-blue-600 text-white"
                          : visit.label === "student"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-white"
                      } text-center`}
                    >
                      {visit.label === "teacher"
                        ? "O'qituvchi"
                        : visit.label === "student"
                          ? "O'quvchi"
                          : "Hodim"}
                    </div>
                    <div
                      className={`inline-block rounded-full px-8 py-0.5 text-sm capitalize ${
                        visit.visitType === "come_in"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      } text-center`}
                    >
                      {translateVisitType(visit.visitType)}
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
