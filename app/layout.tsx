import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FantaMiccio",
  description: "Il fantasy game del palio dei micci",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/contrade/logo500.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/contrade/logo500.png"
        />
        <link
          rel="apple-touch-icon"
          href="/contrade/logo500.png"
        />
        <link
          rel="manifest"
          href="/manifest.webmanifest"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}