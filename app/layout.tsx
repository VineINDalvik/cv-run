import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cv.run — Resume generator",
  description: "Turn your experience into a beautiful resume in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
