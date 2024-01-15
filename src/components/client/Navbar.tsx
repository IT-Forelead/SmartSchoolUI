import React from "react";
import { UserNav } from "./UserNav";

export default function Navbar() {
  return (
    <div className="sticky left-0 right-0 top-0 z-50 flex h-16 w-auto items-center justify-between border-b bg-white p-5 md:left-64">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div>
        <UserNav />
      </div>
    </div>
  );
}
