import type { Metadata } from "next";
import "./globals.css";
import "./game-detail.css";

export const metadata: Metadata = {
  title: "Philosophy · A World Within",
  description: "An incremental journey from curiosity to the edge of consciousness.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}


