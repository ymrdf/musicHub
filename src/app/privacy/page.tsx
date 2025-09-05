import {
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>
        </div>

        {/* 政策内容 */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* 概述 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
              Overview
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                MusicEmit (referred to as "we," "us," or "our") takes your
                privacy seriously. This privacy policy explains how we collect,
                use, store, and protect your personal information. By using our
                services, you agree to our processing of your information in
                accordance with this policy.
              </p>
            </div>
          </section>

          {/* 信息收集 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <EyeIcon className="h-6 w-6 mr-2 text-primary-600" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Information You Provide
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Registration information: username, email address, password
                  </li>
                  <li>Profile information: avatar, bio, music preferences</li>
                  <li>
                    Musical works: sheet music files (PDF), MIDI files, audio
                    files
                  </li>
                  <li>
                    Performance works: recording files, performance descriptions
                  </li>
                  <li>Interactive content: comments, likes, favorites</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Device information: IP address, browser type, operating
                    system
                  </li>
                  <li>Usage data: access times, page views, feature usage</li>
                  <li>
                    Cookies: used to improve user experience and website
                    functionality
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 信息使用 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Information
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Providing and improving our music sharing services</li>
                <li>
                  Processing your registration, login, and account management
                </li>
                <li>Displaying your musical works and performance content</li>
                <li>Facilitating user interaction and collaboration</li>
                <li>Sending service notifications and important updates</li>
                <li>Analyzing usage to improve user experience</li>
                <li>Preventing fraud and abuse</li>
                <li>Complying with legal and regulatory requirements</li>
              </ul>
            </div>
          </section>

          {/* 信息共享 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We do not sell, rent, or trade your personal information. We may
                share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>
                  Musical works and performance content you actively share
                  (according to your privacy settings)
                </li>
                <li>
                  With our service providers (such as cloud storage, analytics
                  services)
                </li>
                <li>
                  To comply with legal regulations or government requirements
                </li>
                <li>To protect our rights, property, or safety</li>
                <li>
                  In case of business transfer or merger (we will notify you in
                  advance)
                </li>
              </ul>
            </div>
          </section>

          {/* 数据安全 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <LockClosedIcon className="h-6 w-6 mr-2 text-primary-600" />
              Data Security
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Using encryption technology to protect data transmission and
                  storage
                </li>
                <li>
                  Implementing access controls and authentication mechanisms
                </li>
                <li>Regular security audits and vulnerability scanning</li>
                <li>
                  Employee security training and confidentiality agreements
                </li>
                <li>Data backup and disaster recovery plans</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                While we take these measures, please note that internet
                transmission and electronic storage methods are not 100% secure.
                We cannot guarantee absolute security of information.
              </p>
            </div>
          </section>

          {/* 您的权利 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Under applicable law, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Access and view your personal information we hold</li>
                <li>Correct or update inaccurate information</li>
                <li>Delete your account and related data</li>
                <li>Restrict or object to processing of your information</li>
                <li>
                  Data portability (obtain your data in a structured format)
                </li>
                <li>Withdraw consent (if processing is based on consent)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the methods
                below.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies and Similar Technologies
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Remember your login status and preferences</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve website functionality and user experience</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can manage cookies through your browser settings, but this
                may affect the use of certain features.
              </p>
            </div>
          </section>

          {/* 儿童隐私 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our services are not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and discover that your
                child has provided us with personal information, please contact
                us immediately.
              </p>
            </div>
          </section>

          {/* 国际传输 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              International Data Transfer
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to servers outside your
                country/region for processing and storage. We ensure these
                transfers comply with applicable data protection laws and
                implement appropriate security measures.
              </p>
            </div>
          </section>

          {/* 政策更新 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Policy Updates
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. For
                significant changes, we will:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Post the updated policy on our website</li>
                <li>Notify you via email or in-app notification</li>
                <li>Update the "Last updated" date at the top of the policy</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We recommend that you review this policy regularly to understand
                how we handle your information.
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
                If you have any questions, comments, or complaints about this
                privacy policy, please contact us through the following methods:
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
              <p className="text-gray-700 leading-relaxed">
                We will respond to your inquiries within a reasonable time.
              </p>
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
