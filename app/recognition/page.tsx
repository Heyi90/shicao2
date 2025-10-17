"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function RecognitionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setRecognitionResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const recognizeImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setRecognitionResult(null);

    try {
      // 提取 base64 数据和图片格式
      const matches = selectedImage.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        throw new Error('无效的图片格式');
      }

      const imageFormat = matches[1];
      const imageBase64 = matches[2];

      const response = await fetch('/api/recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          imageFormat,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '识别失败');
      }

      const result = await response.json();

      // 提取识别结果
      if (result.choices && result.choices[0]?.message?.content) {
        setRecognitionResult(result.choices[0].message.content);
      } else {
        setRecognitionResult(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-8 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 dark:text-green-400 flex items-center gap-2 mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              图片识别
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              AI识别图片内容，提取文字信息
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            上传图片
          </h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              点击上传图片或拖拽图片到此处
            </p>
            <p className="text-sm text-gray-500">支持 JPG、PNG、WebP 格式</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Recognize Button */}
        {selectedImage && !recognitionResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <button
              onClick={recognizeImage}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  识别中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  开始识别
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Preview and Result Section */}
        {selectedImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                图片预览
              </h3>
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Recognition Result */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                识别结果
              </h3>
              {recognitionResult ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {recognitionResult}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    {isProcessing ? '正在识别...' : '点击"开始识别"查看结果'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {recognitionResult && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setRecognitionResult(null);
                setError(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-all"
            >
              识别新图片
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
