import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameTracker - Tu Biblioteca de Videojuegos",
  description: "Organiza, reseña y explora tu colección personal de videojuegos con GameTracker.",
  keywords: ["GameTracker", "videojuegos", "biblioteca", "reseñas", "gaming"],
  authors: [{ name: "GameTracker Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "GameTracker",
    description: "Tu biblioteca personal de videojuegos",
    url: "https://gametracker.com",
    siteName: "GameTracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameTracker",
    description: "Tu biblioteca personal de videojuegos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
