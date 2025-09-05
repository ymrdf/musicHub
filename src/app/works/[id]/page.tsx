import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  EyeIcon,
  PlayIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  MusicalNoteIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  PlusIcon,
  CodeBracketIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { fetchWorkById } from "@/lib/api-utils";
import WorkActions from "@/components/client/WorkActions";
import WorkDetailClient from "@/components/client/WorkDetailClient";
import CollaborationClient from "@/components/client/CollaborationClient";
import RealMidiPlayer from "@/components/works/RealMidiPlayer";

// Dynamically generate metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const work = await fetchWorkById(params.id);

  if (!work) {
    return {
      title: "Work Not Found - MusicEmit",
      description:
        "The work you're looking for doesn't exist or has been deleted",
    };
  }

  return {
    title: `${work.title} - MusicEmit`,
    description:
      work.description ||
      `Original music work created by ${work.user.username}`,
    keywords: `${work.genre?.name || ""},${work.instrument?.name || ""},${
      work.purpose?.name || ""
    },original music,sheet music,MIDI`,
    openGraph: {
      title: work.title,
      description:
        work.description ||
        `Original music work created by ${work.user.username}`,
      type: "music.song",
      url: `https://musicemit.com/works/${work.id}`,
      images: [
        {
          url:
            work.coverImageUrl ||
            "https://musicemit.com/default-work-cover.jpg",
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
  };
}

// Pre-generate static pages for popular works
export async function generateStaticParams() {
  // Here you can get the ID list of popular or important works
  // const works = await fetchPopularWorks(20);
  // return works.map((work) => ({
  //   id: work.id.toString(),
  // }));

  // Simplified version, no pre-generation for now
  return [];
}

// Format file size
function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

export default async function WorkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const work = await fetchWorkById(params.id);

  if (!work) {
    notFound();
  }

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: work.title,
    composer: {
      "@type": "Person",
      name: work.user.username,
    },
    datePublished: work.createdAt,
    genre: work.genre?.name,
    instrument: work.instrument?.name,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "http://schema.org/ViewAction",
        userInteractionCount: work.viewsCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "http://schema.org/LikeAction",
        userInteractionCount: work.starsCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "http://schema.org/CommentAction",
        userInteractionCount: work.commentsCount,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Work header information */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Left: Work information */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {work.title}
                </h1>

                {/* Action buttons - Client component */}
                <WorkActions
                  workId={work.id}
                  isOwner={work.isOwner}
                  isStarred={work.isStarred}
                  starsCount={work.starsCount}
                  title={work.title}
                  description={work.description}
                />
              </div>

              {/* Author information */}
              <div className="flex items-center space-x-4 mb-6">
                <Link
                  href={`/users/${work.user.id}`}
                  className="flex items-center space-x-2 hover:text-primary-600"
                >
                  {work.user.avatarUrl ? (
                    <img
                      src={work.user.avatarUrl}
                      alt={work.user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <span className="font-medium">{work.user.username}</span>
                  {work.user.isVerified && (
                    <span className="text-primary-500" title="Verified user">
                      ✓
                    </span>
                  )}
                </Link>

                <span className="text-gray-300">•</span>

                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(work.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              {work.description && (
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {work.description}
                  </p>
                </div>
              )}

              {/* Categories and tags */}
              <div className="space-y-3 mb-6">
                {/* Category information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {work.genre && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Genre:</span>
                      <span className="font-medium">{work.genre.name}</span>
                    </div>
                  )}
                  {work.instrument && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Instrument:</span>
                      <span className="font-medium">
                        {work.instrument.name}
                      </span>
                    </div>
                  )}
                  {work.purpose && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Purpose:</span>
                      <span className="font-medium">{work.purpose.name}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {work.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map(
                        (tag: { id: number; name: string; color: string }) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: tag.color + "20",
                              color: tag.color,
                            }}
                          >
                            {tag.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="flex space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {work.viewsCount} views
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1" />
                  {work.starsCount} stars
                </div>
                <div className="flex items-center">
                  <PlayIcon className="h-4 w-4 mr-1" />
                  {work.performancesCount} performances
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {work.commentsCount} comments
                </div>
              </div>
            </div>

            {/* Right: File downloads */}
            <div className="lg:w-80 mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  File Downloads
                </h3>

                <div className="space-y-3">
                  {work.pdfFilePath && (
                    <a
                      href={work.pdfFilePath}
                      download
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <DocumentArrowDownIcon className="h-8 w-8 text-red-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            PDF Sheet Music
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(work.pdfFileSize)}
                          </div>
                        </div>
                      </div>
                      <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                    </a>
                  )}

                  {work.midiFilePath && (
                    <a
                      href={work.midiFilePath}
                      download
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <MusicalNoteIcon className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            MIDI File
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(work.midiFileSize)}
                          </div>
                        </div>
                      </div>
                      <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                    </a>
                  )}
                </div>

                {/* License information */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-500">License: </span>
                    <span className="font-medium">{work.license}</span>
                  </div>
                  {work.allowCollaboration && (
                    <div className="mt-2 text-xs text-gray-500">
                      ✓ Collaboration allowed
                    </div>
                  )}
                </div>
              </div>

              {/* Other actions */}
              <div className="mt-4 space-y-2">
                <Link
                  href={`/performances/new?workId=${work.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Record a Cover
                </Link>

                {work.allowCollaboration && (
                  <CollaborationClient
                    workId={work.id}
                    workTitle={work.title}
                    allowCollaboration={work.allowCollaboration}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF sheet music preview area */}
      {work.pdfFilePath && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <DocumentArrowDownIcon className="h-6 w-6 text-red-500 mr-2" />
                  Sheet Music Preview
                </h2>
              </div>
            </div>

            {/* PDF viewer */}
            <div className="p-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <div className="flex justify-center p-4">
                  <iframe
                    src={`${work.pdfFilePath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="w-full"
                    style={{
                      height: "800px",
                      transformOrigin: "top center",
                    }}
                    title="乐谱预览"
                  />
                </div>
              </div>

              {/* 下载提示 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  💡 tips: you can click the download button in the top right
                  corner to get the complete PDF file
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MIDI播放器区域 */}
      {work.midiFilePath && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MusicalNoteIcon className="h-6 w-6 text-blue-500 mr-2" />
                  MIDI
                </h2>
              </div>
            </div>

            {/* MIDI播放器 */}
            <div className="p-4">
              <RealMidiPlayer
                filePath={work.midiFilePath}
                fileName={work.midiFilePath.split("/").pop() || "midi文件"}
                fileSize={work.midiFileSize || 0}
              />

              {/* 下载提示 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  💡 tips: you can click the download button in the top right
                  corner to get the complete MIDI file
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 协作、演奏和评论区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkDetailClient
          workId={work.id}
          isOwner={work.isOwner}
          performancesCount={work.performancesCount}
          allowCollaboration={work.allowCollaboration}
        />
      </div>
    </div>
  );
}
