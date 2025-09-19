import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Search Music - MusicEmit",
  description:
    "Search for music works, performances, and creators on MusicEmit. Find exactly what you're looking for in our music community.",
  keywords:
    "music search,find music,search works,search performances,search creators",
  alternates: {
    canonical: canonicalUrls.search(),
  },
  openGraph: {
    title: "Search Music - MusicEmit",
    description:
      "Search for music works, performances, and creators on MusicEmit. Find exactly what you're looking for in our music community.",
    type: "website",
    url: "https://musicemit.com/search",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Search Music - MusicEmit",
      },
    ],
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
