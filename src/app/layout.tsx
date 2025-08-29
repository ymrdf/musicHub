import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicHub - 原创音乐分享平台",
  description:
    "一个面向音乐创作者的原创音乐分享平台，支持乐谱分享、协作创作、演奏演唱和社区互动。",
  keywords: "音乐创作,乐谱分享,MIDI,演奏,演唱,音乐社区",
  authors: [{ name: "MusicHub Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
