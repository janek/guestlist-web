import * as Sentry from '@sentry/nextjs';
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export function generateMetadata(): Metadata {
  return {
    title: "Guestlist",
    description: "Hello",
    other: {
      ...Sentry.getTraceData()
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
