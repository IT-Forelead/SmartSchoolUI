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
import {
    ArrowUpDown,
    ChevronDown,
    EyeIcon,
    PencilIcon,
    QrCodeIcon,
    TrashIcon
} from "lucide-react"
import * as React from "react"
import Loader from "@/components/client/Loader"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useAddQrcodeToStudent, useEditStudent, useStudentsList} from "@/hooks/useStudents"
import useUserInfo from "@/hooks/useUserInfo"
import {SolarCheckCircleBroken} from "@/icons/ApproveIcon"
import {SolarUserBroken} from "@/icons/UserIcon"
import {dateFormatter} from "@/lib/composables"
import {notifyError, notifySuccess} from "@/lib/notify"
import {Student, StudentUpdate, AddQrCode} from "@/models/common.interface"
import Image from "next/image"
import {useRouter} from "next/navigation"
import {SubmitHandler, useForm} from "react-hook-form"
import {Dispatch, SetStateAction, useEffect, useState} from "react"
import useWebSocket from "react-use-websocket";

const getGroupNameAndLevel = (group: { name: any; level: any }) => {
    if (group && group.name && group.level) {
        return `${group.level} - ${group.name}`;
    } else {
        return "Sinfi yo'q";
    }
};


export const columns = (setStudent: Dispatch<SetStateAction<Student | null>>, showStudents: any): ColumnDef<Student, any>[] => [
    {
        header: "No",
        cell: ({row}) => (
            <div>{parseInt(row.id, 10) + 1}</div>
        ),
    },
    {
        accessorKey: "fullName",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    F.I.SH
                    <ArrowUpDown className="w-4 h-4 ml-2"/>
                </Button>
            )
        },
        cell: ({row}) => (
            <div className="capitalize">{row.getValue('fullName')}</div>
        ),
    },
    {
        accessorKey: "group",
        header: 'Sinfi',
        cell: ({row}) => (
            <div className="uppercase">{getGroupNameAndLevel(row.getValue('group'))}</div>
        ),
    },
    {
        accessorKey: "parentPhone",
        header: 'Ota onasining raqami',
        cell: ({row}) => (
            <div className="uppercase">{row.getValue('parentPhone') ?? "-"}</div>
        ),
    },
    {
        id: "actions",
        header: "Amallar",
        enableHiding: false,
        cell: ({row}) => {
            const student = row.original
            return (
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        className="text-green-600"
                    >
                        <DialogTrigger className="flex items-center" onClick={() => showStudents('show', student)}>
                            <EyeIcon className="text-green-600 w-5 h-5"/>
                        </DialogTrigger>
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-blue-600"
                    >
                        <DialogTrigger className="flex items-center" onClick={() => showStudents('update', student)}>
                            <PencilIcon className="text-blue-600 w-5 h-5"/>
                        </DialogTrigger>
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-red-600"
                    >
                        <DialogTrigger className="text-red-600" onClick={() => showStudents('delete', student)}>
                            <TrashIcon className="w-5 h-5"/>
                        </DialogTrigger>
                    </Button>
                    {student.barcode ? (
                        <Button
                            variant="ghost"
                            className="text-indigo-600"
                        >
                            <DialogTrigger className="flex items-center" onClick={() => showStudents('qrcode', student)}>
                                <QrCodeIcon className="w-5 h-5 text-green-600"/>
                            </DialogTrigger>
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className="text-indigo-600"
                        >
                            <DialogTrigger className="flex items-center" onClick={() => showStudents('qrcode', student)}>
                                <QrCodeIcon className="flex m-auto justify-between w-5 h-5 text-red-600"/>
                            </DialogTrigger>
                        </Button>
                    )
                    }
                </div>
            )
        },
    },
]

export default function StudentsPage() {
    const currentUser = useUserInfo()
    const router = useRouter()

    function showStudents(mode: string, student: Student) {
        setMode(mode)
        setStudent(student)
    }

    // const hostname = window.location.hostname.includes("localhost") ? "localhost:8000" : "25-school.uz/school/api/v1";
    // const protocol = window.location.protocol.includes("https:") ? "wss:" : "ws:";
    const [socketUrl, setSocketUrl] = useState<string>("wss//25-school.uz/school/api/v1/ws")
    const {lastJsonMessage} = useWebSocket(socketUrl)

    useEffect(() => {
        if (!currentUser?.User?.role?.includes('admin')) {
            router.push('/dashboard/denied')
        }
    }, [currentUser?.User?.role, router])
    const [student, setStudent] = useState<Student | null>(null)
    const [mode, setMode] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPageSize] = useState<number>(40)
    const {mutate: editStudent, isSuccess, error} = useEditStudent();
    const {mutate: addQrCodeToStudent, isSuccess: isSuccessAddQrcode, error: addCrcodeError} = useAddQrcodeToStudent();
    const {register, handleSubmit, reset} = useForm<StudentUpdate>();
    const {register: qrCodeRegister, handleSubmit: qrCodeHandleSubmit, setValue, getValues} = useForm<AddQrCode>();

    useEffect(() => {
        reset({...student})
    }, [reset, student])

    useEffect(() => {
      if (mode === 'qrcode' && lastJsonMessage?.kind === "qr_code_assign") {
        setValue("barcodeId", lastJsonMessage?.data ?? "")
      }
    }, [lastJsonMessage])

    useEffect(() => {
        setValue("personId", student?.id ?? "")
    }, [getValues("barcodeId")])

    useEffect(() => {
        if (isSuccessAddQrcode) {
            notifySuccess("Qr kod qo'shildi!")
            setValue("personId", "")
            setValue("barcodeId", "")
            refetch()
            setOpen(false)
        } else if (addCrcodeError) {
            notifyError("Qr kod qo'shishda xatolik yuz berdi!")
        } else return;
    }, [isSuccessAddQrcode, addCrcodeError]);

    const onSubmit: SubmitHandler<StudentUpdate> = (data) => editStudent(data);
    const onSubmitAddQrcode: SubmitHandler<AddQrCode> = (data) => addQrCodeToStudent(data);
    const {data, isError, isLoading, refetch} = useStudentsList();

    useEffect(() => {
        if (isSuccess) {
            notifySuccess("O`zgarishlar saqlandi")
            refetch()
            setOpen(false)
        } else if (error) {
            notifyError("O`zgarishlarni saqlashda muammo yuzaga keldi")
        } else return;
    }, [isSuccess, error]);

    let students = data?.data ?? []
    const table = useReactTable({
        data: students,
        columns: columns(setStudent, showStudents),
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
    table.getState().pagination.pageSize = 40
    if (isLoading) {
        return <Loader/>
    }
    const image = null
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={mode?.includes('show') ? `max-w-5xl` : `max-w-2xl`}>
                <DialogHeader>
                    {mode?.includes('show') ?
                        <DialogTitle>O`quvchi ma`lumotlari</DialogTitle> : mode?.includes('qrcode') ?
                            <DialogTitle>O`quvchiga QR kod biriktirish</DialogTitle> : mode?.includes('update') ?
                                <DialogTitle>O`quvchini tahrirlash</DialogTitle> : mode?.includes('delete')
                    }
                </DialogHeader>
                {mode?.includes('show') ?
                    <div className="px-4 py-2">
                        <div className="flex p-5 space-y-4 bg-white rounded">
                            <div className="flex items-start space-x-4">
                                {
                                    image ?
                                        <div>
                                            <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                                                   className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"/>
                                        </div> :
                                        <div>
                                            <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5"/>
                                        </div>
                                }
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            F.I.SH:
                                        </div>
                                        <div className="text-lg font-medium uppercase">
                                            {student?.fullName}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Sinfi:
                                        </div>
                                        <div className="text-lg font-medium">
                                            {student?.group?.level}-{student?.group?.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Telefon:
                                        </div>
                                        <div className="text-lg font-medium">
                                            {student?.parentPhone}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            QR kod:
                                        </div>
                                        <div className="text-lg font-medium">
                                            {student?.barcode ? student?.barcode : '-'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Jinsi:
                                        </div>
                                        <div className="text-lg font-medium">
                                            {student?.gender.includes('female') ? 'Ayol' : 'Erkak'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Millati:
                                        </div>
                                        <div className="text-lg font-medium capitalize">
                                            {student?.nationality ?? "-"}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Hujjat turi:
                                        </div>
                                        <div className="text-lg font-medium capitalize">
                                            {student?.documentType}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Hujjat raqami:
                                        </div>
                                        <div className="text-lg font-medium capitalize">
                                            {student?.documentSeries} {student?.documentNumber}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Yaratilgan sana:
                                        </div>
                                        <div className="text-lg font-medium">
                                            {dateFormatter(student?.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : mode?.includes('qrcode') ? <form onSubmit={qrCodeHandleSubmit(onSubmitAddQrcode)}>
                        <div className="space-y-3">
                            <div className="flex flex-col items-center w-full space-y-2">
                                {
                                    image ?
                                        <div>
                                            <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                                                   className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"/>
                                        </div> :
                                        <div>
                                            <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5"/>
                                        </div>
                                }
                                <div className="w-full text-lg font-medium text-center uppercase">
                                    {student?.fullName}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {student?.barcode ? (
                                    <>
                                        <QrCodeIcon className="w-8 h-8 text-gray-500"/><h1 className="flex w-full p-2 border-2">{student.barcode}</h1>
                                    </>
                                ) : (
                                    <>
                                        <QrCodeIcon className="w-8 h-8 text-gray-500"/>
                                        <Input
                                            className="w-full text-base text-green-900 font-bold uppercase  placeholder:font-medium placeholder:normal-case"
                                            placeholder="QR kodni skanerlang..." {...qrCodeRegister("barcodeId", {required: true})} disabled/>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-end">
                                <Button autoFocus={true}>
                                    <SolarCheckCircleBroken className='w-6 h-6 mr-2'/>
                                    QR kod biriktirish
                                </Button>
                            </div>
                        </div>
                    </form> : <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full space-y-4 bg-white rounded">
                            <div className="flex items-start space-x-4">
                                {
                                    image ?
                                        <div>
                                            <Image src="/public/test.png" alt="teacher image" width={100} height={100}
                                                   className="object-cover w-32 h-32 duration-500 border rounded-lg cursor-zoom-out hover:object-scale-down"/>
                                        </div> :
                                        <div>
                                            <SolarUserBroken className="w-32 h-32 rounded-lg text-gray-500 border p-1.5"/>
                                        </div>
                                }
                                <div className="w-full space-y-3">
                                    <div className="flex items-center w-full space-x-2">
                                        <div className="text-base text-gray-500">
                                            F.I.SH:
                                        </div>
                                        <div className="w-full text-lg font-medium capitalize">
                                            <Input type="text" className="w-full" {...register("fullName", {required: false})} />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base text-gray-500">
                                            Telefon:
                                        </div>
                                        <div className="w-full text-lg font-medium capitalize">
                                            <Input className="w-full" {...register("parentPhone", {required: false})} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button autoFocus={true}>Saqlash</Button>
                        </div>
                    </form>
                }
            </DialogContent>
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
                                Ustunlar <ChevronDown className="w-4 h-4 ml-2"/>
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
                                <TableRow key={headerGroup.id} >
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