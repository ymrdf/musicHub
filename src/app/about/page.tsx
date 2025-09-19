import { Metadata } from "next";
import {
  MusicalNoteIcon,
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { canonicalUrls } from "@/utils/canonical";

export const metadata: Metadata = {
  title: "About MusicEmit - The GitHub for Musicians | Original Music Platform",
  description:
    "Discover MusicEmit's mission to connect global music creators. Learn how we're building the ultimate platform for original music sharing, music collaboration, and music community building. Join thousands of composers, musicians, and performers.",
  keywords:
    "about musicemit,original music platform,music collaboration,music community,github for musicians,music creators,composer community,musical collaboration,indie music platform,music sharing community,collaborative music creation,musician network",
  alternates: {
    canonical: canonicalUrls.about(),
  },
  openGraph: {
    title:
      "About MusicEmit - The GitHub for Musicians | Original Music Platform",
    description:
      "Discover MusicEmit's mission to connect global music creators. Learn how we're building the ultimate platform for original music sharing and collaboration.",
    type: "website",
    url: "https://musicemit.com/about",
    images: [
      {
        url: "https://musicemit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About MusicEmit - Original Music Platform",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <MusicalNoteIcon className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-music">
              About MusicEmit
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              The Original Music Sharing Platform Connecting Global Creators
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To become the "GitHub for musicians," providing a complete
              ecosystem for sharing, collaboration, covers, and community
              interaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Showcase Talent */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Showcase Talent
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Provide a platform for all musicians, performers, and vocalists
                - both famous and unknown - to showcase their talents and be
                recognized for their abilities, rather than remaining in
                obscurity.
              </p>
            </div>

            {/* Collaborative Growth */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Collaborative Growth
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Give emerging creators opportunities to receive guidance from
                experienced musicians. Allow works to be improved through
                collaborative editing and feedback, fostering growth through
                community support.
              </p>
            </div>

            {/* Rich Choices */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Rich Choices
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Offer music lovers more choices with access to the latest and
                most diverse music. Discover quality indie original music and
                enjoy a rich, varied musical experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600">
              A GitHub-like music creation sharing community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sheet Music & MIDI Sharing
                  </h3>
                  <p className="text-gray-600">
                    Support uploading PDF sheet music and MIDI files. Each work
                    functions like a GitHub repository with homepage, versions,
                    and commit history.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MicrophoneIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Performance & Vocal Uploads
                  </h3>
                  <p className="text-gray-600">
                    Users can click "Record a Cover" to upload their own
                    recordings, creating a "Cover Gallery" for each work.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Collaboration Features
                  </h3>
                  <p className="text-gray-600">
                    Support "Pull Request"-style MIDI editing. Users can submit
                    modification requests with complete version history
                    tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Community Interaction
                  </h3>
                  <p className="text-gray-600">
                    Star system, comments, likes and ratings, trending charts -
                    building an active music community.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                    <MusicalNoteIcon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    GitHub for Musicians
                  </h3>
                  <p className="text-primary-100 mb-6">
                    Here, every musical work is a project, every collaboration
                    is a contribution, and every performance is a share.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">10K+</div>
                      <div className="text-sm text-primary-200">
                        Original Works
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">5K+</div>
                      <div className="text-sm text-primary-200">
                        Music Creators
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Serve
            </h2>
            <p className="text-xl text-gray-600">
              Professional services for different types of music enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Music Creators
              </h3>
              <p className="text-gray-600 text-sm">
                Individuals or groups who create original sheet music and MIDI
                files
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <MicrophoneIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Performers & Vocalists
              </h3>
              <p className="text-gray-600 text-sm">
                Skilled instrumentalists and singers looking to showcase their
                talents through the platform
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Music Enthusiasts
              </h3>
              <p className="text-gray-600 text-sm">
                Music lovers who enjoy listening, providing feedback, and
                discovering quality music
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <SparklesIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lyricists
              </h3>
              <p className="text-gray-600 text-sm">
                Users who specialize in creating lyrics for existing melodies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Vision</h2>
          <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed mb-12">
            Building a platform where every music creator can be heard, seen,
            and recognized. Whether you're a beginner or a professional
            musician, you'll find your stage here to share your creations and
            talents with music lovers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/works/new"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Creating
            </a>
            <a
              href="/discover"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Discover Music
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
