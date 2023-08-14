"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { ArrowUpDown, CopyIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"

import TeacherProfile from "@/components/client/TeacherProfile"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export type Teacher = {
  data: {
    "id": string,
    "createdAt": string,
    "dateOfBirth": string,
    "gender": "female" | "male",
    "fullName": string,
    "nationality": string,
    "citizenship": string,
    "documentType": string,
    "documentSeries": string,
    "documentNumber": string,
    "pinfl": string
  }
  subjectName: string
  degree: string
}

function getDataFromObject(row: any, key: string) {
  return JSON.parse(JSON.stringify(row))[key] ?? ''
}

export const columns: ColumnDef<Teacher>[] = [
  {
    header: "No",
    cell: ({ row }) => (
      <div>{parseInt(row.id, 10) + 1}</div>
    ),
  },
  {
    accessorKey: "data",
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
      <div className="capitalize">{getDataFromObject(row.getValue('data'), 'fullName')}</div>
    ),
  },
  {
    accessorKey: "subjectName",
    header: 'Ixtisosligi',
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue('subjectName')}</div>
    ),
  },
  {
    accessorKey: "degree",
    header: 'Darajasi',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('degree')}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original

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
            <DropdownMenuItem className="text-gray-600"
              onClick={() => navigator.clipboard.writeText(teacher.data.fullName)}
            >
              <CopyIcon className="w-4 h-4 mr-1" />
              Nusxalash
            </DropdownMenuItem>
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
      )
    },
  },
]

export default function ProfilePage() {
  return (
    <>
      <TeacherProfile />
    </>
  )
}