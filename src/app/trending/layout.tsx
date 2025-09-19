import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Trending Original Music - Popular Music Community | MusicEmit",
  description:
    "Discover the hottest trending original music works and performances in our music community. See what's popular among composers, musicians, and music creators worldwide on MusicEmit.",
  keywords:
    "trending original music,popular music,music community trends,hot original music,trending compositions,popular music works,music collaboration trends,indie music trends,original music charts,composer trends,musician community",
  alternates: {
    canonical: canonicalUrls.trending(),
  },
  openGraph: {
    title: "Trending Original Music - Popular Music Community | MusicEmit",
    description:
      "Discover the hottest trending original music works and performances in our music community. See what's popular among composers and musicians worldwide.",
    type: "website",
    url: "https://musicemit.com/trending",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trending Original Music - MusicEmit",
      },
    ],
  },
};

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
