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
  title: {
    default: "DevFlow — Code • Share • Grow",
    template: "%s · DevFlow",
  },
  description: "A community for developers to share code, ask questions, and show off projects.",
  applicationName: "DevFlow",
  openGraph: {
    title: "DevFlow",
    description: "A community for developers to share code, ask questions, and show off projects.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0d0f14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
