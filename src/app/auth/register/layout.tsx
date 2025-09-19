import { Metadata } from "next";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "Join Music Community - Create Account | MusicEmit",
  description:
    "Join the global music community on MusicEmit. Create your account to share original music, collaborate with composers, discover amazing works, and connect with musicians worldwide.",
  keywords:
    "join music community,music creators signup,original music platform,music collaboration,composer community,musician network,music sharing platform,indie music community,collaborative music creation",
  alternates: {
    canonical: canonicalUrls.register(),
  },
  openGraph: {
    title: "Join Music Community - Create Account | MusicEmit",
    description:
      "Join the global music community on MusicEmit. Create your account to share original music, collaborate with composers, and connect with musicians worldwide.",
    type: "website",
    url: "https://musicemit.com/auth/register",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Join Music Community - MusicEmit",
      },
    ],
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
