import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "../styles/uswds.css";
import "./globals.scss";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MilitaryAdmin.org",
  description:
    "Secure family access and identity verification portal for U.S. military families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} app-body`}>
        {children}
      </body>
    </html>
  );
}
