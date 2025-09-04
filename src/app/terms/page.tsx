"use client";

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
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <DocumentTextIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">服务条款</h1>
          <p className="text-lg text-gray-600">
            最后更新时间：{new Date().toLocaleDateString("zh-CN")}
          </p>
        </div>

        {/* 条款内容 */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* 概述 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">概述</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                欢迎使用 MusicEmit！这些服务条款（以下简称"条款"）是您与
                MusicEmit 之间就使用我们的音乐分享平台服务达成的协议。
                通过访问或使用我们的服务，您同意遵守这些条款。
              </p>
            </div>
          </section>

          {/* 服务描述 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              服务描述
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                MusicEmit 是一个面向音乐创作者的原创音乐分享平台，提供以下服务：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>乐谱和 MIDI 文件的上传、存储和分享</li>
                <li>演奏和演唱作品的录制和展示</li>
                <li>音乐作品评论和互动功能</li>
                <li>用户社区和协作创作工具</li>
                <li>音乐发现和推荐服务</li>
                <li>相关技术支持和客户服务</li>
              </ul>
            </div>
          </section>

          {/* 用户账户 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2 text-primary-600" />
              用户账户
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  账户注册
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>您必须年满13岁才能注册账户</li>
                  <li>提供真实、准确、完整的注册信息</li>
                  <li>保护您的账户安全，不得与他人共享账户</li>
                  <li>及时更新您的个人信息</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  账户责任
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>您对账户下的所有活动负责</li>
                  <li>如发现未授权使用，请立即通知我们</li>
                  <li>我们有权暂停或终止违规账户</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 内容政策 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              内容政策
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  允许的内容
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>您原创的音乐作品（乐谱、MIDI、音频）</li>
                  <li>您拥有版权的音乐内容</li>
                  <li>获得授权的第三方音乐作品</li>
                  <li>符合社区规范的评论和互动内容</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
                  禁止的内容
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>侵犯他人知识产权的音乐作品</li>
                  <li>含有暴力、色情、仇恨言论的内容</li>
                  <li>恶意软件、病毒或其他有害文件</li>
                  <li>垃圾信息、广告或商业推广</li>
                  <li>虚假或误导性信息</li>
                  <li>违反法律法规的内容</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 知识产权 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              知识产权
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  您的内容
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  您保留对上传内容的完整知识产权。通过上传内容，您授予我们非独占、免版税的许可，
                  用于在平台上展示、分发和推广您的内容。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  平台内容
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  MusicEmit
                  平台本身（包括但不限于软件、设计、商标）受知识产权法保护。
                  未经许可，您不得复制、修改或分发这些内容。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  版权投诉
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  如果您认为平台上的内容侵犯了您的版权，请通过我们的版权投诉程序联系我们。
                  我们将根据相关法律处理投诉。
                </p>
              </div>
            </div>
          </section>

          {/* 用户行为规范 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              用户行为规范
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                在使用我们的服务时，您同意：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>尊重其他用户和他们的创作</li>
                <li>提供有建设性的评论和反馈</li>
                <li>不进行骚扰、威胁或欺凌行为</li>
                <li>不试图破坏平台安全或稳定性</li>
                <li>遵守所有适用的法律法规</li>
                <li>不从事任何可能损害平台声誉的活动</li>
              </ul>
            </div>
          </section>

          {/* 服务可用性 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              服务可用性
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们努力提供稳定可靠的服务，但请注意：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>服务可能因维护、升级或其他原因暂时中断</li>
                <li>我们不保证服务100%可用或无误</li>
                <li>我们可能会修改、暂停或终止某些功能</li>
                <li>我们不对因服务中断造成的损失承担责任</li>
              </ul>
            </div>
          </section>

          {/* 免责声明 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              免责声明
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                在法律允许的最大范围内：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>我们按"现状"提供服务，不提供任何明示或暗示的保证</li>
                <li>我们不保证服务的安全性、准确性或完整性</li>
                <li>我们不承担因使用服务而产生的任何直接或间接损失</li>
                <li>用户对上传内容的合法性和适当性负责</li>
              </ul>
            </div>
          </section>

          {/* 责任限制 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              责任限制
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                在法律允许的范围内，我们的总责任不超过您在过去12个月内支付给我们的费用总额，
                或100元人民币（以较高者为准）。
              </p>
            </div>
          </section>

          {/* 服务终止 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              服务终止
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  您终止服务
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  您可以随时删除账户或停止使用我们的服务。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  我们终止服务
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  我们可能在以下情况下终止您的服务：
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>违反这些条款</li>
                  <li>从事非法或有害活动</li>
                  <li>长期不使用账户</li>
                  <li>其他我们认为必要的情况</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 条款修改 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              条款修改
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们可能会不时修改这些条款。重大变更时，我们会：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>在网站上发布更新后的条款</li>
                <li>通过邮件或应用内通知您</li>
                <li>在条款顶部更新"最后更新时间"</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                继续使用服务即表示您接受修改后的条款。
              </p>
            </div>
          </section>

          {/* 适用法律 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              适用法律
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                这些条款受中华人民共和国法律管辖。任何争议应通过友好协商解决，
                协商不成的，提交有管辖权的人民法院处理。
              </p>
            </div>
          </section>

          {/* 联系我们 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              联系我们
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                如果您对这些服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>邮箱：</strong> 837856276@qq.com
                </p>
                <p className="text-gray-700">
                  <strong>地址：</strong> 中国上海
                </p>
                <p className="text-gray-700">
                  <strong>电话：</strong> +086-15663632812
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
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
