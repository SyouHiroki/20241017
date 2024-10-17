'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type LinkType = {text: string, link: string}

export type HeaderLogoLinkType = LinkType
export type HeaderNavsLinkType = LinkType[]

export default function Header({navsLink, logoLink} : {navsLink: HeaderNavsLinkType, logoLink: HeaderLogoLinkType}) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)

  return (
    <div className="p-2 flex justify-between">
      <Link className="flex items-center px-2" href={logoLink.link}>
        <Image src='/assets/logo.svg' width={32} height={32} className="w-8 h-8" alt='logo' />
        <div className="font-extrabold text-2xl py-2" style={{fontFamily: 'Tiempos, serif'}}>{logoLink.text}</div>
      </Link>

      {/* md */}
      <div className="font-medium items-center hidden md:flex">
        {navsLink.map((v, i) => <Link key={i} className="py-2 px-4 text-nowrap hover:underline" href={v.link}>{v.text}</Link>)}
      </div>

      {/* sm */}
      <div className="font-medium items-center flex md:hidden flex-shrink-0">
        <Image src={menuIsOpen ? '/assets/close.svg' : '/assets/menu.svg'} width={28} height={28} className="w-7 h-7" alt='menu' onClick={() => setMenuIsOpen(!menuIsOpen)}/>

        {menuIsOpen &&
          <div className="absolute left-0 top-16 border-t flex flex-col w-full py-4 bg-white">
            {navsLink.map((v, i) => <Link key={i} className="py-2 px-4 text-nowrap" href={v.link}>{v.text}</Link>)}
          </div>
        }
      </div>
    </div>
  )
}