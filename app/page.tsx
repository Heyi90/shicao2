import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "快速压缩图片，减小文件大小，保持画质",
      href: "/compress",
      icon: "📦",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "抠图去背景",
      description: "智能识别主体，一键去除背景",
      href: "/remove-bg",
      icon: "✂️",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      href: "/recognition",
      icon: "🔍",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "AI 生图",
      description: "文字描述生成精美图片",
      href: "/generate",
      icon: "🎨",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-12 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          图片处理工具箱
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          一站式图片处理平台，让图片处理更简单
        </p>
      </header>

      {/* Feature Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

              <div className="relative">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                <div className={`mt-6 inline-flex items-center text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  开始使用
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2025 图片处理工具箱 - 让图片处理更简单</p>
      </footer>
    </div>
  );
}
