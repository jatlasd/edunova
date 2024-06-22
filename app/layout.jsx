import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { GlobalProvider } from "@/lib/GlobalProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@components/ui/toaster";
import { StudentProvider } from "@lib/StudentProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "EduNova",
  description: "Transforming Data Into Progress",
  icons: {
    icon: "/icons/logo.png",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          " bg-gradient min-h-screen h-full font-sans antialiased",
          fontSans.variable,
        )}
      >
        <GlobalProvider>
          <main className="h-full">
            <Navbar />
            <StudentProvider>

            {children}
            </StudentProvider>
            <Toaster />
          </main>
        </GlobalProvider>
      </body>
    </html>
  );
};

export default RootLayout;
