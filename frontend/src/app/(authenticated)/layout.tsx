import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SideMenu from "./main/components/SideMenu";
import Footer from "./main/components/Footer";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <SideMenu />
          {children}
          {/* <Footer /> */}
        </body>
      </html>
    </UserProvider>
  );
}
