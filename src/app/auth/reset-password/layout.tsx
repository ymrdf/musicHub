import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Reset Password - MusicEmit",
  description:
    "Set a new password for your MusicEmit account. Enter your new password to regain access to your account.",
  keywords: "reset password,new password,change password,account security",
  alternates: {
    canonical: canonicalUrls.resetPassword(),
  },
  openGraph: {
    title: "Reset Password - MusicEmit",
    description:
      "Set a new password for your MusicEmit account. Enter your new password to regain access to your account.",
    type: "website",
    url: "https://musicemit.com/auth/reset-password",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reset Password - MusicEmit",
      },
    ],
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
