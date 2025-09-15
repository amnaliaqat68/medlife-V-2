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

export const metadata = {
  title: "MedCSR",
  description: "Digitizing CSR Workflows with MedCSR",
  // manifest: "/manifest.json",
  // icons: {
  //   icon: "/Medlife-logo-192x192.png",
  //   apple: "/Medlife-logo-192x192.png",
  // },
};
export const viewport = {
  themeColor: "#4f46e5",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}