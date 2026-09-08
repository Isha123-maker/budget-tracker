import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "PKR Budget Tracker",
  description: "A localized PKR budget tracker app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "font-sans",
          geist.variable,
          geistMono.variable,
          lora.variable,
        )}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
