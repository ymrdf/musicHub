import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Feedback & Suggestions - MusicEmit",
  description:
    "Share your feedback and suggestions with MusicEmit. Help us improve our music sharing platform by reporting bugs, suggesting features, and sharing your experience.",
  keywords:
    "feedback,suggestions,bug report,feature request,user experience,contact support",
  alternates: {
    canonical: canonicalUrls.feedback(),
  },
  openGraph: {
    title: "Feedback & Suggestions - MusicEmit",
    description:
      "Share your feedback and suggestions with MusicEmit. Help us improve our music sharing platform by reporting bugs, suggesting features, and sharing your experience.",
    type: "website",
    url: "https://musicemit.com/feedback",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Feedback & Suggestions - MusicEmit",
      },
    ],
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
