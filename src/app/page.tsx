import { Metadata } from "next";
import {
  MusicalNoteIcon,
  StarIcon,
  PlayIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import StatsDisplay from "@/components/client/StatsDisplay";
import { fetchStats, fetchRecommendations } from "@/lib/api-utils";
import dynamic from "next/dynamic";

// Dynamically import client component, disable server-side rendering
const RecommendationSection = dynamic(
  () => import("@/components/RecommendationSection"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "MusicEmit - Original Music Sharing Platform",
  description:
    "The original music sharing platform connecting global creators. Share your compositions, discover amazing music, and collaborate with like-minded musicians.",
  keywords:
    "music creation,sheet music sharing,MIDI,performance,vocals,music community,original music,music collaboration",
  openGraph: {
    title: "MusicEmit - Original Music Sharing Platform",
    description:
      "The original music sharing platform connecting global creators. Share your compositions, discover amazing music, and collaborate with like-minded musicians.",
    type: "website",
    url: "https://musicemit.com",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MusicEmit - Original Music Sharing Platform",
      },
    ],
  },
};

export default async function HomePage() {
  // Server-side data fetching
  const stats = await fetchStats();
  const recommendations = await fetchRecommendations();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-music-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-music">
            Welcome to MusicEmit
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            The Original Music Sharing Platform Connecting Global Creators
          </p>
          <p className="text-lg text-white opacity-80 mb-10 max-w-2xl mx-auto">
            Share your original compositions, discover amazing music,
            collaborate with like-minded musicians, and spread the power of
            music to every corner of the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Join Now
            </a>
            <a
              href="/discover"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              <MusicalNoteIcon className="h-5 w-5 mr-2" />
              Discover Music
            </a>
            <a
              href="/trending"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              <FireIcon className="h-5 w-5 mr-2" />
              Trending
            </a>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsDisplay initialStats={stats} />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Music Creators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MusicEmit provides comprehensive solutions for music creation,
              sharing, and collaboration, helping you unleash your musical
              talent to its fullest potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MusicalNoteIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Original Work Sharing
              </h3>
              <p className="text-gray-600">
                Upload your PDF sheet music and MIDI files to share your
                creations with more people
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Performance & Vocal Showcase
              </h3>
              <p className="text-gray-600">
                Record and share your performances and vocals, exchange and
                learn with other musicians
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborative Creation
              </h3>
              <p className="text-gray-600">
                Collaborate with musicians from around the world to create even
                better works together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation sections */}
      <RecommendationSection
        title="🔥 Hot Creations"
        items={recommendations.hotWorks}
        viewAllLink="/trending?type=work"
        loading={false}
      />

      <RecommendationSection
        title="🎵 Hot Performances"
        items={recommendations.hotPerformances}
        viewAllLink="/discover?sortBy=likesCount&sortOrder=desc"
        loading={false}
      />

      <RecommendationSection
        title="✨ Latest Creations"
        items={recommendations.latestWorks}
        viewAllLink="/works?sortBy=createdAt&sortOrder=desc"
        loading={false}
      />

      <RecommendationSection
        title="🎤 Latest Performances"
        items={recommendations.latestPerformances}
        viewAllLink="/discover?sortBy=createdAt&sortOrder=desc"
        loading={false}
      />

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join MusicEmit and create a wonderful musical world together with
            creators from around the globe.
          </p>
          <a
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Join for Free
          </a>
        </div>
      </section>
    </div>
  );
}
