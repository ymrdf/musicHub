import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Original Music Works - Music Creation & Composition | MusicEmit",
  description:
    "Discover thousands of original music works and compositions on MusicEmit. Browse sheet music, MIDI files, and musical creations from talented composers worldwide. Join the music creation community.",
  keywords:
    "music works,original music,music composition,music creation,sheet music,MIDI files,original compositions,music library,composer works,musical works,music scores,indie music,collaborative music,music sharing,music community,original songs,music creators,composition sharing",
  alternates: {
    canonical: canonicalUrls.works(),
  },
  openGraph: {
    title: "Original Music Works - Music Creation & Composition | MusicEmit",
    description:
      "Discover thousands of original music works and compositions on MusicEmit. Browse sheet music, MIDI files, and musical creations from talented composers worldwide.",
    type: "website",
    url: "https://musicemit.com/works",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Original Music Works - MusicEmit",
      },
    ],
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
