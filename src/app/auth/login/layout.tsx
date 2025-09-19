import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Sign In to Music Community | MusicEmit",
  description:
    "Sign in to your MusicEmit account to access your original music works, collaborate with composers, share performances, and connect with the global music community.",
  keywords:
    "music community login,composer signin,musician account,original music platform,music collaboration,music sharing platform,indie music community",
  alternates: {
    canonical: canonicalUrls.login(),
  },
  openGraph: {
    title: "Sign In to Music Community | MusicEmit",
    description:
      "Sign in to your MusicEmit account to access your original music works, collaborate with composers, and connect with the global music community.",
    type: "website",
    url: "https://musicemit.com/auth/login",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sign In - MusicEmit",
      },
    ],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
