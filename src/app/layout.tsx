import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AudioPlayer } from "@/components/music/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicEmit - 原创音乐分享平台",
  description:
    "一个面向音乐创作者的原创音乐分享平台，支持乐谱分享、协作创作、演奏演唱和社区互动。",
  keywords: "音乐创作,乐谱分享,MIDI,演奏,演唱,音乐社区",
  authors: [{ name: "MusicEmit Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AudioPlayer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
