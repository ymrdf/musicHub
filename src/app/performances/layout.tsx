import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title:
    "Music Performances & Recordings - Original Music Community | MusicEmit",
  description:
    "Listen to incredible music performances and recordings from talented musicians worldwide. Discover original music covers, vocal performances, instrumental showcases, and collaborative music projects on MusicEmit.",
  keywords:
    "music performances,music recordings,original music,music covers,vocal performances,instrumental performances,music collaboration,live music,music community,musician showcases,performance sharing,music talents,collaborative performances,indie music performances,original covers",
  alternates: {
    canonical: canonicalUrls.performances(),
  },
  openGraph: {
    title:
      "Music Performances & Recordings - Original Music Community | MusicEmit",
    description:
      "Listen to incredible music performances and recordings from talented musicians worldwide. Discover original music covers, vocal performances, and collaborative projects.",
    type: "website",
    url: "https://musicemit.com/performances",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Music Performances - MusicEmit",
      },
    ],
  },
};

export default function PerformancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
