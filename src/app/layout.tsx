import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import DarkIcon from "/public/icons/favicon-dark.ico";
import LightIcon from "/public/icons/favicon.ico";

import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers";
import Header from "@/components/header/header";
import "./globals.css";
import ScrollToTopButton from "@/components/scroll-to-top/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "CSView",
  description:
    "Table view for CSV",
  authors: [
    { name: "Muhammad Zulfikar" },
    {
      name: "Muhammad Zulfikar",
      url: "https://github.com/muhammad-zulfikar/",
    },
  ],
  icons: [
    {
      rel: "icon",
      media: "(prefers-color-scheme: light)",
      type: "image/x-icon",
      url: LightIcon.src,
    },
    {
      rel: "icon",
      media: "(prefers-color-scheme: dark)",
      type: "image/x-icon",
      url: DarkIcon.src,
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <ScrollToTopButton />
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
