import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TLS Web",
  description: "TLS Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
