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
  title: "PCM Syllabus Tracker | JEE Mains & Advanced",
  description: "A brutalist, high-performance spaced repetition tracker for Class 11 and 12 Physics, Chemistry, and Mathematics (PCM). Designed for JEE Mains, JEE Advanced, and CBSE students to master their syllabus.",
  keywords: [
    "PCM syllabus tracker",
    "JEE Mains syllabus tracker",
    "JEE Advanced tracker",
    "Physics Chemistry Math",
    "spaced repetition JEE",
    "Class 11 PCM",
    "Class 12 PCM",
    "study planner",
    "IIT JEE revision tracker",
    "brutalist study tracker"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "PCM Syllabus Tracker | JEE Mains & Advanced",
    description: "A high-performance spaced repetition tracker for Class 11 & 12 PCM. Master your JEE syllabus.",
    siteName: "PCM Syllabus Tracker"
  },
  twitter: {
    card: "summary_large_image",
    title: "PCM Syllabus Tracker | JEE Mains & Advanced",
    description: "Track and master your JEE PCM syllabus with automated spaced repetition."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { borderRadius: 0, border: '1px solid rgba(255,255,255,0.1)', background: 'black', color: 'white', fontFamily: 'monospace' } }} />
      </body>
    </html>
  );
}
