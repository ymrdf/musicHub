import {
  MusicalNoteIcon,
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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
              关于 MusicEmit
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              连接全球音乐创作者的原创音乐分享平台
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              我们的使命
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              成为音乐创作者的「GitHub」，提供分享、协作、二次演绎和社区互动的完整闭环
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 展示才华 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                展示才华
              </h3>
              <p className="text-gray-600 leading-relaxed">
                为所有知名的及不知名的音乐创作者、音乐演奏者、歌唱爱好者提供一个平台，让他们能表现自己的才能，让人能看到自己的才华，而不是默默无闻。
              </p>
            </div>

            {/* 协作成长 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                协作成长
              </h3>
              <p className="text-gray-600 leading-relaxed">
                给初级创作者接受别的创作者指导的机会，自己的作品可以接受别人的协同工作和编辑，以使它更好。通过社区的力量共同进步。
              </p>
            </div>

            {/* 丰富选择 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                丰富选择
              </h3>
              <p className="text-gray-600 leading-relaxed">
                给音乐爱好者更多的选择，可以听到最新的、最多的音乐。发现小众原创好音乐，享受多元化的音乐体验。
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
              平台特色
            </h2>
            <p className="text-xl text-gray-600">
              类似 GitHub 的音乐创作分享社区
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
                    乐谱与 MIDI 分享
                  </h3>
                  <p className="text-gray-600">
                    支持上传 PDF 乐谱和 MIDI 文件，每个作品类似 GitHub
                    仓库，有主页、版本、提交记录。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MicrophoneIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    演奏与演唱上传
                  </h3>
                  <p className="text-gray-600">
                    用户可点击「我要演奏/演唱」，上传自己的录音，形成「二次创作展示库」。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    协作功能
                  </h3>
                  <p className="text-gray-600">
                    支持「Pull Request」式的 MIDI
                    编辑，用户可提交修改请求，保持所有历史版本可追溯。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    社区互动
                  </h3>
                  <p className="text-gray-600">
                    Star 收藏、评论留言、点赞评价、Trending
                    热榜，打造活跃的音乐社区。
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
                    音乐创作者的 GitHub
                  </h3>
                  <p className="text-primary-100 mb-6">
                    在这里，每个音乐作品都是一个项目，每次协作都是一次贡献，每个演奏都是一次分享。
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">打造10K+</div>
                      <div className="text-sm text-primary-200">原创作品</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">吸引5K+</div>
                      <div className="text-sm text-primary-200">音乐创作者</div>
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
              我们服务的用户
            </h2>
            <p className="text-xl text-gray-600">
              为不同类型的音乐爱好者提供专业服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                音乐创作者
              </h3>
              <p className="text-gray-600 text-sm">
                创作原创曲谱、MIDI 的个人或团体
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <MicrophoneIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                演奏者/歌唱者
              </h3>
              <p className="text-gray-600 text-sm">
                擅长乐器演奏或演唱，想通过平台展示才华
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                音乐爱好者
              </h3>
              <p className="text-gray-600 text-sm">
                喜欢听音乐、给出评价、发现优质音乐
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <SparklesIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                歌词创作者
              </h3>
              <p className="text-gray-600 text-sm">
                专注于为现有旋律创作歌词的用户
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">我们的愿景</h2>
          <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed mb-12">
            打造一个让每个音乐创作者都能被听见、被看见、被认可的平台。
            无论你是初学者还是专业音乐人，在这里都能找到属于自己的舞台，
            与全世界的音乐爱好者分享你的创作和才华。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/works/new"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              开始创作
            </a>
            <a
              href="/discover"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              发现音乐
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
