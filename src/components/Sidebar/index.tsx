"use client"

import { usePathname } from "next/navigation"
import { css } from "../../../styled-system/css"
import Image from "next/image"

const items = [
  {
    href: "/messages",
    icon: "/chat.svg",
    alt: "Messages",
  },
  {
    href: "/account",
    icon: "/account.svg",
    alt: "Account",
  },
  {
    href: "/#",
    icon: "/exit.svg",
    alt: "Sign out",
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  if (pathname === "/" || pathname === "/register") {
    return null
  }

  return (
    <nav className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', position: "absolute", width: 12, bgColor: "teal.600", h: "100vh" })}>
      <ul className={css({ w: '100%' })}>
        {items.map((item) => (
          <li key={item.href} className={css({ py: 2, bgColor: pathname === item.href ? "teal.800" : "" })}>
            <a href={item.href}>
              <Image src={item.icon} alt={item.alt} width={36} height={36} className={css({ margin: "0 auto" })} />
            </a>
          </li>))}
      </ul>
    </nav>
  )
}
