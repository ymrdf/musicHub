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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">隐私政策</h1>
          <p className="text-lg text-gray-600">
            最后更新时间：{new Date().toLocaleDateString("zh-CN")}
          </p>
        </div>

        {/* 政策内容 */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* 概述 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
              概述
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                MusicEmit（以下简称"我们"）非常重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
                通过使用我们的服务，您同意我们按照本政策处理您的信息。
              </p>
            </div>
          </section>

          {/* 信息收集 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <EyeIcon className="h-6 w-6 mr-2 text-primary-600" />
              我们收集的信息
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  您主动提供的信息
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>注册信息：用户名、邮箱地址、密码</li>
                  <li>个人资料：头像、个人简介、音乐偏好</li>
                  <li>音乐作品：乐谱文件（PDF）、MIDI文件、音频文件</li>
                  <li>演奏作品：录音文件、演奏描述</li>
                  <li>互动内容：评论、点赞、收藏记录</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  自动收集的信息
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>设备信息：IP地址、浏览器类型、操作系统</li>
                  <li>使用数据：访问时间、页面浏览、功能使用情况</li>
                  <li>Cookies：用于改善用户体验和网站功能</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 信息使用 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              信息使用
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们使用收集的信息用于以下目的：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>提供和改进我们的音乐分享服务</li>
                <li>处理您的注册、登录和账户管理</li>
                <li>展示您的音乐作品和演奏内容</li>
                <li>促进用户之间的互动和协作</li>
                <li>发送服务通知和重要更新</li>
                <li>分析使用情况以改善用户体验</li>
                <li>防止欺诈和滥用行为</li>
                <li>遵守法律法规要求</li>
              </ul>
            </div>
          </section>

          {/* 信息共享 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              信息共享
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们不会出售、出租或交易您的个人信息。在以下情况下，我们可能会共享您的信息：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>获得您的明确同意</li>
                <li>与您主动分享的音乐作品和演奏内容（根据您的隐私设置）</li>
                <li>与我们的服务提供商合作（如云存储、分析服务）</li>
                <li>遵守法律法规或政府要求</li>
                <li>保护我们的权利、财产或安全</li>
                <li>在业务转让或合并时（会提前通知您）</li>
              </ul>
            </div>
          </section>

          {/* 数据安全 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <LockClosedIcon className="h-6 w-6 mr-2 text-primary-600" />
              数据安全
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们采用行业标准的安全措施保护您的信息：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>使用加密技术保护数据传输和存储</li>
                <li>实施访问控制和身份验证机制</li>
                <li>定期安全审计和漏洞扫描</li>
                <li>员工安全培训和保密协议</li>
                <li>数据备份和灾难恢复计划</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                尽管我们采取了这些措施，但请注意互联网传输和电子存储方法并非100%安全。
                我们无法保证信息的绝对安全。
              </p>
            </div>
          </section>

          {/* 您的权利 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              您的权利
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                根据适用法律，您享有以下权利：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>访问和查看我们持有的您的个人信息</li>
                <li>更正或更新不准确的信息</li>
                <li>删除您的账户和相关数据</li>
                <li>限制或反对处理您的信息</li>
                <li>数据可携带性（以结构化格式获取您的数据）</li>
                <li>撤回同意（如果处理基于同意）</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                如需行使这些权利，请通过以下方式联系我们。
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies 和类似技术
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们使用 Cookies 和类似技术来：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>记住您的登录状态和偏好设置</li>
                <li>分析网站使用情况和性能</li>
                <li>提供个性化内容和推荐</li>
                <li>改善网站功能和用户体验</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                您可以通过浏览器设置管理 Cookies，但这可能影响某些功能的使用。
              </p>
            </div>
          </section>

          {/* 儿童隐私 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              儿童隐私
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。
                如果您是父母或监护人，发现您的孩子向我们提供了个人信息，请立即联系我们。
              </p>
            </div>
          </section>

          {/* 国际传输 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              国际数据传输
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                您的信息可能被传输到您所在国家/地区以外的服务器进行处理和存储。
                我们会确保这些传输符合适用的数据保护法律，并采取适当的安全措施。
              </p>
            </div>
          </section>

          {/* 政策更新 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              政策更新
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我们可能会不时更新本隐私政策。重大变更时，我们会：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>在网站上发布更新后的政策</li>
                <li>通过邮件或应用内通知您</li>
                <li>在政策顶部更新"最后更新时间"</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                建议您定期查看本政策以了解我们如何处理您的信息。
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
                如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
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
              <p className="text-gray-700 leading-relaxed">
                我们会在合理时间内回复您的询问。
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
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
