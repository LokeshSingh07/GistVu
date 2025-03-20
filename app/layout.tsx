import type { Metadata } from "next";
import "./globals.css";
import { ToastWrapper } from "@/components/ToastWrapper";


export const metadata: Metadata = {
  title: "Gistvu",
  description: "Code sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-black text-white max-w-[1600px] h-full mx-auto`}
      >
        {children}
        <ToastWrapper/>
      </body>
    </html>
  );
}
