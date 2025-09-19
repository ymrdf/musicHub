import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Verify Email - MusicEmit",
  description:
    "Verify your email address to complete your MusicEmit account setup and access all platform features.",
  keywords:
    "verify email,email verification,account verification,confirm email",
  alternates: {
    canonical: canonicalUrls.verifyEmail(),
  },
  openGraph: {
    title: "Verify Email - MusicEmit",
    description:
      "Verify your email address to complete your MusicEmit account setup and access all platform features.",
    type: "website",
    url: "https://musicemit.com/auth/verify-email",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Verify Email - MusicEmit",
      },
    ],
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
