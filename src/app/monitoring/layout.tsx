import { Provider } from "@/components/client/Provider";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import {UserNav} from "@/components/client/UserNav";
import React from "react";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen">
            <div className="flex-auto overflow-auto">
                <div
                    className='sticky top-0 left-0 right-0 z-50 flex items-center justify-between w-auto h-16 p-5 bg-white border-b md:left-64'>
                    <div>
                        <h1 className='text-5xl'>
                            <span className='font-bold text-blue-600'>25</span>
                            <b className='text-3xl font-extrabold'>SCHOOL</b>
                        </h1>
                    </div>
                    <div>
                        <UserNav/>
                    </div>
                </div>
                <div>
                    <Provider>{children}</Provider>
                </div>
            </div>
            <Toaster/>
        </div>
    );
}
