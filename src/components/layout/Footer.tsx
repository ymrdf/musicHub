"use client";

import Link from "next/link";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "发现音乐", href: "/discover" },
      { name: "热榜", href: "/trending" },
      { name: "创建作品", href: "/works/new" },
      { name: "用户指南", href: "/help" },
    ],
    community: [
      { name: "音乐论坛", href: "/forum" },
      { name: "创作者中心", href: "/creators" },
      { name: "音乐教程", href: "/tutorials" },
      { name: "活动公告", href: "/events" },
    ],
    company: [
      { name: "关于我们", href: "/about" },
      { name: "意见反馈", href: "/feedback" },
      { name: "隐私政策", href: "/privacy" },
      { name: "服务条款", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo 和描述 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <MusicalNoteIcon className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white font-music">
                MusicHub
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-6 mb-4">
              连接全球音乐创作者的原创音乐分享平台。在这里分享你的创作，发现优秀作品，与志同道合的音乐人协作创作。
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                <span className="sr-only">微博</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.996 21.908c-5.293 0-9.581-4.29-9.581-9.583s4.288-9.583 9.581-9.583c5.292 0 9.58 4.29 9.58 9.583s-4.288 9.583-9.58 9.583zm-.001-17.71c-4.473 0-8.127 3.655-8.127 8.127 0 4.472 3.654 8.126 8.127 8.126s8.126-3.654 8.126-8.126c0-4.472-3.653-8.127-8.126-8.127z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                <span className="sr-only">微信</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.6 12.6c-.4 0-.8-.4-.8-.8s.4-.8.8-.8.8.4.8.8-.4.8-.8.8zm2.8 0c-.4 0-.8-.4-.8-.8s.4-.8.8-.8.8.4.8.8-.4.8-.8.8z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
              >
                <span className="sr-only">QQ</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.02c2.74 0 4.99 2.25 4.99 4.99v.02c0 .55-.45 1-1 1s-1-.45-1-1v-.02c0-1.65-1.34-2.99-2.99-2.99s-2.99 1.34-2.99 2.99v.02c0 .55-.45 1-1 1s-1-.45-1-1v-.02c0-2.74 2.25-4.99 4.99-4.99z" />
                </svg>
              </a>
            </div>
          </div>
          <div></div>

          {/* 产品链接 */}
          <div>
            <h3 className="text-white font-semibold mb-4">产品</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 社区链接 */}
          {/* <div>
            <h3 className="text-white font-semibold mb-4">社区</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* 公司链接 */}
          <div>
            <h3 className="text-white font-semibold mb-4">公司</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部分割线和版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} MusicHub. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                服务条款
              </Link>
              <Link
                href="/help"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                帮助中心
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
