"use client";

import { useState } from "react";
import {
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  UserGroupIcon,
  MusicalNoteIcon,
  PlayIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqData: FAQItem[] = [
    // Account related
    {
      question: "How to register a MusicEmit account?",
      answer:
        "Click the 'Join for Free' button on the homepage, fill in your username, email and password to complete registration. You need to verify your email after registration to use all features.",
      category: "account",
    },
    {
      question: "What to do if I forgot my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and we will send a password reset link to your email.",
      category: "account",
    },
    {
      question: "How to edit my profile?",
      answer:
        "After logging in, click on your avatar in the top right corner and select 'Profile' to edit your avatar, username, bio and other information.",
      category: "account",
    },
    {
      question: "How to delete my account?",
      answer:
        "Find 'Account Settings' on your profile page and select 'Delete Account'. Please note that all data will be unrecoverable after account deletion.",
      category: "account",
    },
    // Work Upload
    {
      question: "What file formats are supported?",
      answer:
        "Sheet music supports PDF format, MIDI files support .mid and .midi formats, and audio files support MP3 and WAV formats.",
      category: "upload",
    },
    {
      question: "Are there file size limits?",
      answer: "PDF files max 50MB, MIDI files max 10MB, audio files max 100MB.",
      category: "upload",
    },
    {
      question: "How to upload musical works?",
      answer:
        "Click 'Create Work', fill in work information, upload sheet music and MIDI files, add category tags, and click publish.",
      category: "upload",
    },
    {
      question: "How to upload performance works?",
      answer:
        "Click 'Record a Cover' on the work page, record or upload audio files, add performance description, and click publish.",
      category: "upload",
    },
    // Features
    {
      question: "How to favorite works?",
      answer:
        "Click the star icon on the work page to favorite. You can view all favorites in 'Starred Works' on your profile page.",
      category: "features",
    },
    {
      question: "How to comment on works?",
      answer:
        "Enter your comment in the comment section at the bottom of the work page and click 'Post Comment'.",
      category: "features",
    },
    {
      question: "How to follow other users?",
      answer:
        "Click the 'Follow' button on the user's profile page to follow them. After following, you can see their latest updates on the homepage.",
      category: "features",
    },
    {
      question: "How to search for musical works?",
      answer:
        "Use the search box at the top to search by work name, creator, tags, or category.",
      category: "features",
    },
    // Copyright Issues
    {
      question:
        "What copyright issues should I be aware of when uploading works?",
      answer:
        "You can only upload works that you created or own the rights to. Do not upload music content that infringes on others' intellectual property.",
      category: "copyright",
    },
    {
      question: "What to do if I find infringing content?",
      answer:
        "Click the 'Report' button on the work page, select 'Copyright Infringement' and provide relevant evidence. We will handle it promptly.",
      category: "copyright",
    },
    {
      question: "What to do if my work is being infringed?",
      answer:
        "Please contact our copyright protection team, provide your copyright proof and infringement evidence, and we will assist you in handling it.",
      category: "copyright",
    },
    // Technical Issues
    {
      question: "What to do if audio won't play?",
      answer:
        "Please check your network connection and try refreshing the page. If the problem persists, clear your browser cache or try a different browser.",
      category: "technical",
    },
    {
      question: "What to do if upload fails?",
      answer:
        "Please check if the file format and size meet the requirements, and if your network connection is stable. If the problem persists, please contact customer service.",
      category: "technical",
    },
    {
      question: "What to do if pages load slowly?",
      answer:
        "Please check your network connection and try refreshing the page. If the problem persists, the server might be busy, please try again later.",
      category: "technical",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: QuestionMarkCircleIcon },
    { id: "account", name: "Account Management", icon: UserGroupIcon },
    { id: "upload", name: "Work Upload", icon: MusicalNoteIcon },
    { id: "features", name: "Features", icon: PlayIcon },
    {
      id: "copyright",
      name: "Copyright Issues",
      icon: ExclamationTriangleIcon,
    },
    { id: "technical", name: "Technical Issues", icon: BookOpenIcon },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <QuestionMarkCircleIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find the answers and guidance you need
          </p>
        </div>

        {/* Quick navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="/auth/register"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <UserGroupIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Register Account</span>
            </a>
            <a
              href="/works/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <MusicalNoteIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Upload Works</span>
            </a>
            <a
              href="/discover"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PlayIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Discover Music</span>
            </a>
            <a
              href="/trending"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <StarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Trending Charts</span>
            </a>
            <a
              href="/privacy"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Privacy Policy</span>
            </a>
            <a
              href="#contact"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">Contact Support</span>
            </a>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ 列表 */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const isExpanded = expandedItems.has(index);
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 联系客服 */}
        <div id="contact" className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Support
          </h2>
          <p className="text-gray-700 mb-6">
            If you haven't found the answer you need, please contact us through
            the following methods:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">837856276@qq.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Usually responds within 24 hours
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Weekdays 9:00-18:00</p>
              <p className="text-sm text-gray-500 mt-1">
                Real-time online support
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Copyright Issues
              </h3>
              <p className="text-gray-600">837856276@qq.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Specialized in handling copyright-related matters
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Technical Issues
              </h3>
              <p className="text-gray-600">837856276@qq.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Handling technical failures and bugs
              </p>
            </div>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
