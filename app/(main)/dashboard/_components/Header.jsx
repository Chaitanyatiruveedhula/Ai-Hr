'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FloatingNav } from './FloatingNavbar'

export const navItems = [
  { name: 'Dashboard', link: '/dashboard' },
  { name: 'How it works', link: '/overview' },
]
export const Header = () => {
  const path = usePathname()
  useEffect(() => {
    console.log(path)
  })
  const router = useRouter()
  return (
    <div className="flex p-4 items-center justify-between shadow-sm sticky top-0 z-50 ">
      <FloatingNav navItems={navItems} />
      <div className="absolute right-7 top-4">
        <UserButton />
      </div>
    </div>
  )
}
