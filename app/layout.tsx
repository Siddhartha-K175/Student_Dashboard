import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Track your placement prep roadmap and DSA practice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
