"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function CompressPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 保存原始文件大小
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setCompressedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // 压缩图片
      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          setCompressedSize(blob.size);
          const reader = new FileReader();
          reader.onload = (e) => {
            setCompressedImage(e.target?.result as string);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed_${Date.now()}.jpg`;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const compressionRatio = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-8 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              图片压缩
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              快速压缩图片，减小文件大小，保持画质
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
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="text-6xl mb-4">📤</div>
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

        {/* Compression Controls */}
        {originalImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              压缩设置
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-3 font-medium">
                压缩质量: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>最小</span>
                <span>最大</span>
              </div>
            </div>

            <button
              onClick={compressImage}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
            >
              开始压缩
            </button>
          </div>
        )}

        {/* Preview Section */}
        {originalImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                原始图片
              </h3>
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto"
                />
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <p>文件大小: <span className="font-semibold">{formatFileSize(originalSize)}</span></p>
              </div>
            </div>

            {/* Compressed Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                压缩后图片
              </h3>
              {compressedImage ? (
                <>
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-4">
                    <p>文件大小: <span className="font-semibold">{formatFileSize(compressedSize)}</span></p>
                    <p>压缩率: <span className="font-semibold text-green-600">{compressionRatio}%</span></p>
                  </div>
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    保存压缩图片
                  </button>
                </>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
                  <p className="text-gray-500">调整压缩质量后点击"开始压缩"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
