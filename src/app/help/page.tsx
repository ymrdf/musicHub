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
    // 账户相关
    {
      question: "如何注册 MusicEmit 账户？",
      answer:
        "点击首页的'立即加入'按钮，填写用户名、邮箱和密码即可完成注册。注册后需要验证邮箱才能使用完整功能。",
      category: "account",
    },
    {
      question: "忘记密码怎么办？",
      answer:
        "在登录页面点击'忘记密码'，输入您的邮箱地址，我们会发送重置密码的链接到您的邮箱。",
      category: "account",
    },
    {
      question: "如何修改个人资料？",
      answer:
        "登录后点击右上角的头像，选择'个人资料'即可修改头像、用户名、个人简介等信息。",
      category: "account",
    },
    {
      question: "如何删除账户？",
      answer:
        "在个人资料页面找到'账户设置'，选择'删除账户'。请注意，删除账户后所有数据将无法恢复。",
      category: "account",
    },
    // 作品上传
    {
      question: "支持哪些文件格式？",
      answer:
        "乐谱支持 PDF 格式，MIDI 文件支持 .mid 和 .midi 格式，音频文件支持 MP3、WAV 格式。",
      category: "upload",
    },
    {
      question: "文件大小有限制吗？",
      answer: "PDF 文件最大 50MB，MIDI 文件最大 10MB，音频文件最大 100MB。",
      category: "upload",
    },
    {
      question: "如何上传音乐作品？",
      answer:
        "点击'创建作品'，填写作品信息，上传乐谱和 MIDI 文件，添加分类标签，点击发布即可。",
      category: "upload",
    },
    {
      question: "如何上传演奏作品？",
      answer:
        "在作品页面点击'我要演奏'，录制或上传音频文件，添加演奏描述，点击发布即可。",
      category: "upload",
    },
    // 功能使用
    {
      question: "如何收藏喜欢的作品？",
      answer:
        "在作品页面点击星形图标即可收藏。您可以在个人主页的'收藏作品'中查看所有收藏。",
      category: "features",
    },
    {
      question: "如何评论作品？",
      answer: "在作品页面底部的评论区输入您的评论，点击'发表评论'即可。",
      category: "features",
    },
    {
      question: "如何关注其他用户？",
      answer:
        "在用户主页点击'关注'按钮即可关注该用户，关注后可以在首页看到他们的最新动态。",
      category: "features",
    },
    {
      question: "如何搜索音乐作品？",
      answer: "使用顶部搜索框，可以按作品名称、创作者、标签或分类进行搜索。",
      category: "features",
    },
    // 版权问题
    {
      question: "上传作品需要注意什么版权问题？",
      answer:
        "只能上传您原创或拥有版权的作品。不得上传侵犯他人知识产权的音乐内容。",
      category: "copyright",
    },
    {
      question: "发现侵权内容怎么办？",
      answer:
        "点击作品页面的'举报'按钮，选择'版权侵权'并提供相关证据，我们会及时处理。",
      category: "copyright",
    },
    {
      question: "我的作品被侵权了怎么办？",
      answer:
        "请联系我们的版权保护团队，提供您的版权证明和侵权证据，我们会协助您处理。",
      category: "copyright",
    },
    // 技术问题
    {
      question: "音频播放不了怎么办？",
      answer:
        "请检查网络连接，尝试刷新页面。如果问题持续，请清除浏览器缓存或尝试其他浏览器。",
      category: "technical",
    },
    {
      question: "上传失败怎么办？",
      answer:
        "请检查文件格式和大小是否符合要求，网络连接是否稳定。如果问题持续，请联系客服。",
      category: "technical",
    },
    {
      question: "页面加载很慢怎么办？",
      answer:
        "请检查网络连接，尝试刷新页面。如果问题持续，可能是服务器繁忙，请稍后再试。",
      category: "technical",
    },
  ];

  const categories = [
    { id: "all", name: "全部问题", icon: QuestionMarkCircleIcon },
    { id: "account", name: "账户管理", icon: UserGroupIcon },
    { id: "upload", name: "作品上传", icon: MusicalNoteIcon },
    { id: "features", name: "功能使用", icon: PlayIcon },
    { id: "copyright", name: "版权问题", icon: ExclamationTriangleIcon },
    { id: "technical", name: "技术问题", icon: BookOpenIcon },
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
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <QuestionMarkCircleIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">帮助中心</h1>
          <p className="text-lg text-gray-600">找到您需要的答案和指导</p>
        </div>

        {/* 快速导航 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速导航</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="/auth/register"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <UserGroupIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">注册账户</span>
            </a>
            <a
              href="/works/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <MusicalNoteIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">上传作品</span>
            </a>
            <a
              href="/discover"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PlayIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">发现音乐</span>
            </a>
            <a
              href="/trending"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <StarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">热门榜单</span>
            </a>
            <a
              href="/privacy"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">隐私政策</span>
            </a>
            <a
              href="#contact"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 mr-3" />
              <span className="font-medium">联系客服</span>
            </a>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">常见问题</h2>
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
            联系客服
          </h2>
          <p className="text-gray-700 mb-6">
            如果您没有找到需要的答案，请通过以下方式联系我们：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">邮箱支持</h3>
              <p className="text-gray-600">support@MusicEmit.com</p>
              <p className="text-sm text-gray-500 mt-1">通常在24小时内回复</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">在线客服</h3>
              <p className="text-gray-600">工作日 9:00-18:00</p>
              <p className="text-sm text-gray-500 mt-1">实时在线支持</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">版权问题</h3>
              <p className="text-gray-600">copyright@MusicEmit.com</p>
              <p className="text-sm text-gray-500 mt-1">专门处理版权相关事务</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">技术问题</h3>
              <p className="text-gray-600">tech@MusicEmit.com</p>
              <p className="text-sm text-gray-500 mt-1">处理技术故障和bug</p>
            </div>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
