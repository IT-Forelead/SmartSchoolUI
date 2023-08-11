'use client'
import { deleteCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center font-normal">
          <Avatar className="w-8 h-8">
            {/* <AvatarImage src="/avatars/01.png" alt="User image" /> */}
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-3 space-y-1">
            <p className="text-sm font-medium leading-none">Super admin</p>
            <p className="text-xs leading-none text-muted-foreground">
              login here
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profil
          </DropdownMenuItem>
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