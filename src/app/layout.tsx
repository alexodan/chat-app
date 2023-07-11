import "./global.css"
import { Inter } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import { css } from "../../styled-system/css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chat App',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <div className={css({ ml: 12 })}>{children}</div>
      </body>
    </html>
  )
}
