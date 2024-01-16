"use client";
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserNav() {
  const currentUser = useUserInfo();
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
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border shadow focus-visible:ring-0 dark:border-slate-600 dark:shadow-none"
        >
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="User image" /> */}
            <AvatarFallback className="uppercase">
              {currentUser?.User?.role[0] ?? ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 dark:bg-slate-900"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex items-center font-normal">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="User image" /> */}
            <AvatarFallback className="uppercase">
              {currentUser?.User?.role[0] ?? ""}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex flex-col space-y-1">
            <p className="text-sm font-medium capitalize leading-none">
              {currentUser?.User?.role ?? ""}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {currentUser?.User?.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/dashboard/profile"}>
            <DropdownMenuItem>Profil</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center"
        >
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
