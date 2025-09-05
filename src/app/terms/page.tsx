import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <DocumentTextIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>
        </div>

        {/* Terms content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Welcome to MusicEmit! These Terms of Service ("Terms")
                constitute an agreement between you and MusicEmit regarding your
                use of our music sharing platform services. By accessing or
                using our services, you agree to be bound by these Terms.
              </p>
            </div>
          </section>

          {/* 服务描述 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Service Description
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                MusicEmit is an original music sharing platform for music
                creators, providing the following services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Upload, storage, and sharing of sheet music and MIDI files
                </li>
                <li>Recording and showcasing of performance and vocal works</li>
                <li>Music work commenting and interaction features</li>
                <li>User community and collaborative creation tools</li>
                <li>Music discovery and recommendation services</li>
                <li>Related technical support and customer service</li>
              </ul>
            </div>
          </section>

          {/* 用户账户 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2 text-primary-600" />
              User Accounts
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Account Registration
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    You must be at least 13 years old to register an account
                  </li>
                  <li>
                    Provide true, accurate, and complete registration
                    information
                  </li>
                  <li>
                    Protect your account security and do not share your account
                    with others
                  </li>
                  <li>Update your personal information promptly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Account Responsibility
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    You are responsible for all activities under your account
                  </li>
                  <li>
                    Notify us immediately if you discover unauthorized use
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts that
                    violate our terms
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 内容政策 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Content Policy
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Allowed Content
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Your original musical works (sheet music, MIDI, audio)
                  </li>
                  <li>Music content you own the rights to</li>
                  <li>Third-party musical works with proper authorization</li>
                  <li>
                    Comments and interactive content that comply with community
                    standards
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                  Prohibited Content
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Musical works that infringe on others' intellectual property
                  </li>
                  <li>
                    Content containing violence, pornography, or hate speech
                  </li>
                  <li>Malware, viruses, or other harmful files</li>
                  <li>Spam, advertising, or commercial promotion</li>
                  <li>False or misleading information</li>
                  <li>Content that violates laws and regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 知识产权 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your Content
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain full intellectual property rights to your uploaded
                  content. By uploading content, you grant us a non-exclusive,
                  royalty-free license to display, distribute, and promote your
                  content on the platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Platform Content
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The MusicEmit platform itself (including but not limited to
                  software, design, trademarks) is protected by intellectual
                  property laws. You may not copy, modify, or distribute this
                  content without permission.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Copyright Complaints
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  If you believe content on our platform infringes your
                  copyright, please contact us through our copyright complaint
                  process. We will handle complaints in accordance with
                  applicable laws.
                </p>
              </div>
            </div>
          </section>

          {/* 用户行为规范 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Conduct Guidelines
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Respect other users and their creations</li>
                <li>Provide constructive comments and feedback</li>
                <li>Not engage in harassment, threats, or bullying</li>
                <li>
                  Not attempt to compromise platform security or stability
                </li>
                <li>Comply with all applicable laws and regulations</li>
                <li>
                  Not engage in any activities that may harm the platform's
                  reputation
                </li>
              </ul>
            </div>
          </section>

          {/* 服务可用性 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Service Availability
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We strive to provide stable and reliable services, but please
                note:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Services may be temporarily interrupted due to maintenance,
                  upgrades, or other reasons
                </li>
                <li>
                  We do not guarantee 100% availability or error-free service
                </li>
                <li>We may modify, suspend, or terminate certain features</li>
                <li>
                  We are not responsible for losses caused by service
                  interruptions
                </li>
              </ul>
            </div>
          </section>

          {/* 免责声明 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclaimer
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  We provide services "as is" without any express or implied
                  warranties
                </li>
                <li>
                  We do not guarantee the security, accuracy, or completeness of
                  our services
                </li>
                <li>
                  We are not liable for any direct or indirect losses arising
                  from the use of our services
                </li>
                <li>
                  Users are responsible for the legality and appropriateness of
                  uploaded content
                </li>
              </ul>
            </div>
          </section>

          {/* 责任限制 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To the extent permitted by law, our total liability shall not
                exceed the total amount you have paid us in the past 12 months,
                or $15 USD (whichever is greater).
              </p>
            </div>
          </section>

          {/* 服务终止 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Service Termination
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your Termination
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You may delete your account or stop using our services at any
                  time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Our Termination
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate your service under the following
                  circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Violation of these terms</li>
                  <li>Engaging in illegal or harmful activities</li>
                  <li>Long-term account inactivity</li>
                  <li>Other circumstances we deem necessary</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 条款修改 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Terms Modification
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may modify these terms from time to time. For significant
                changes, we will:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Post the updated terms on our website</li>
                <li>Notify you via email or in-app notification</li>
                <li>Update the "Last updated" date at the top of the terms</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Continued use of our services constitutes acceptance of the
                modified terms.
              </p>
            </div>
          </section>

          {/* 适用法律 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Governing Law
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of the United States. Any
                disputes shall be resolved through friendly negotiation, and if
                negotiation fails, shall be submitted to the competent courts
                for resolution.
              </p>
            </div>
          </section>

          {/* 联系我们 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us through the following methods:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> 837856276@qq.com
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Shanghai, China
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +86-15663632812
                </p>
              </div>
            </div>
          </section>
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
