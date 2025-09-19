import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Share Original Music - Create Music Work | MusicEmit",
  description:
    "Share your original music composition with the global music community. Upload sheet music and MIDI files to showcase your creativity, connect with fellow composers, and collaborate on musical projects.",
  keywords:
    "share original music,create music composition,upload sheet music,MIDI upload,music creation,composer community,original composition sharing,music collaboration,indie music creation,musical work sharing",
  alternates: {
    canonical: canonicalUrls.workNew(),
  },
  openGraph: {
    title: "Share Original Music - Create Music Work | MusicEmit",
    description:
      "Share your original music composition with the global music community. Upload sheet music and MIDI files to showcase your creativity and connect with composers.",
    type: "website",
    url: "https://musicemit.com/works/new",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Share Original Music - MusicEmit",
      },
    ],
  },
};

export default function NewWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
