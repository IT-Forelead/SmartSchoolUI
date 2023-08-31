import React from 'react'
import { UserNav } from './UserNav'

export default function Navbar() {
  return (
    <div className='sticky top-0 left-0 right-0 z-50 flex items-center justify-between w-auto h-16 p-5 bg-white border-b md:left-64'>
      <div>
        <h1 className='text-2xl font-semibold'>Admin panel</h1>
      </div>
      <div>
        <UserNav />
      </div>
    </div>
  )
}
