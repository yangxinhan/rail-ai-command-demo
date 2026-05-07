import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAIL AI — 軌道異物與安全偵測系統",
  description: "主動式邊緣運算防護網 (Proactive Edge-Computing Defense Network) — 即時辨識、即時決策、即時連動煞車",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
