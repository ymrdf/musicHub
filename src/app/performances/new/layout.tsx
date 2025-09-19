import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Share Music Performance - Record & Upload | MusicEmit",
  description:
    "Record and share your original music performance with the global music community. Upload vocal or instrumental recordings, connect with fellow musicians, and showcase your musical talent on MusicEmit.",
  keywords:
    "share music performance,record original music,upload music recording,vocal performance,instrumental recording,musician community,music collaboration,performance sharing,indie music performance,original music covers",
  alternates: {
    canonical: canonicalUrls.performanceNew(),
  },
  openGraph: {
    title: "Share Music Performance - Record & Upload | MusicEmit",
    description:
      "Record and share your original music performance with the global music community. Upload recordings and connect with fellow musicians.",
    type: "website",
    url: "https://musicemit.com/performances/new",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Share Music Performance - MusicEmit",
      },
    ],
  },
};

export default function NewPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
