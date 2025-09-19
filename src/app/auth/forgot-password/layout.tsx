import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Forgot Password - MusicEmit",
  description:
    "Reset your MusicEmit account password. Enter your email address to receive password reset instructions.",
  keywords: "forgot password,reset password,password recovery,account recovery",
  alternates: {
    canonical: canonicalUrls.forgotPassword(),
  },
  openGraph: {
    title: "Forgot Password - MusicEmit",
    description:
      "Reset your MusicEmit account password. Enter your email address to receive password reset instructions.",
    type: "website",
    url: "https://musicemit.com/auth/forgot-password",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Forgot Password - MusicEmit",
      },
    ],
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
