'use client'
import useUserInfo from "@/hooks/useUserInfo";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

export function UserNav() {
  const currentUser = useUserInfo()
  function logout() {
    // Logging out the user by removing all the tokens from local
    deleteCookie("access-token");
    deleteCookie("refresh-token");
    deleteCookie("user-info");
    // Redirecting the user to the landing page
    window.location.href = window.location.origin;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 border rounded-full shadow">
          <Avatar className="w-8 h-8">
            {/* <AvatarImage src="/avatars/01.png" alt="User image" /> */}
            <AvatarFallback className="uppercase">{currentUser?.role[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center font-normal">
          <Avatar className="w-8 h-8">
            {/* <AvatarImage src="/avatars/01.png" alt="User image" /> */}
            <AvatarFallback className="uppercase">{currentUser?.role[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-3 space-y-1">
            <p className="text-sm font-medium leading-none capitalize">{currentUser?.role}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={'/dashboard/profile'}>
            <DropdownMenuItem>
              Profil
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            Sozlamalar
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="flex items-center">
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}