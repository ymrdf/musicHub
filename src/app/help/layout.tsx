import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title:
    "Music Platform Help - Learn Music Sharing & Collaboration | MusicEmit",
  description:
    "Learn how to use MusicEmit's music sharing and collaboration features. Get help with uploading original music, sharing compositions, recording performances, music collaboration, and connecting with the music community.",
  keywords:
    "music platform help,music sharing guide,original music upload,music collaboration help,music community guide,sheet music sharing,MIDI upload,music performance recording,composer help,musician guide,music creation help,collaborative music guide",
  alternates: {
    canonical: canonicalUrls.help(),
  },
  openGraph: {
    title:
      "Music Platform Help - Learn Music Sharing & Collaboration | MusicEmit",
    description:
      "Learn how to use MusicEmit's music sharing and collaboration features. Get help with uploading original music, sharing compositions, and connecting with musicians.",
    type: "website",
    url: "https://musicemit.com/help",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Music Platform Help - MusicEmit",
      },
    ],
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
