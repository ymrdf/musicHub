import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title:
    "Discover Original Music - Music Creation & Collaboration Platform | MusicEmit",
  description:
    "Explore and discover incredible original music works, compositions, and performances from talented creators worldwide. Join the music community and find your next favorite original music on MusicEmit.",
  keywords:
    "discover original music,music discovery,original compositions,music exploration,indie music,music community,collaborative music,music creators,original music platform,music sharing,composer works,musical discoveries",
  alternates: {
    canonical: canonicalUrls.discover(),
  },
  openGraph: {
    title:
      "Discover Original Music - Music Creation & Collaboration Platform | MusicEmit",
    description:
      "Explore and discover incredible original music works, compositions, and performances from talented creators worldwide. Join the music community.",
    type: "website",
    url: "https://musicemit.com/discover",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Discover Original Music - MusicEmit",
      },
    ],
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
