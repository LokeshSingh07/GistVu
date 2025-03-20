import type { Metadata } from "next";
import "./globals.css";
import { ToastWrapper } from "@/components/ToastWrapper";
import { ThemeProvider } from "@/components/ui/theme-provider";



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
        className={` max-w-[1600px] h-full mx-auto`}
      > 
        <ThemeProvider>

        {children}
        </ThemeProvider>
        <ToastWrapper/>
      </body>
    </html>
  );
}
