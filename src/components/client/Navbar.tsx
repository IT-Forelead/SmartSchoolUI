import React from 'react'
import { UserNav } from './UserNav'

export default function Navbar() {
  return (
    <div className='absolute top-0 right-0 flex items-center justify-between w-auto h-16 p-5 bg-white border-b left-64'>
      <div>
        <h1 className='text-2xl font-semibold'>Profil</h1>
      </div>
      <div>
        <UserNav />
      </div>
    </div>
  )
}
