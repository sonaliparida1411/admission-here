import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a3068",
};

export const metadata: Metadata = {
  title: "Admission Here | Higher Education Discovery & Cutoff Platform",
  description:
    "India's authoritative Higher Education Discovery Directory, Cutoff Predictor Engine, and Dual AI Search Engine Platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
