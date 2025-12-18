'use client';

import Link from 'next/link';
import { FiHome, FiCamera, FiLogIn, FiBox, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname(); // ページ移動を検知するために使用

  // 画面が表示されるたびにログイン状態（localStorage）を確認
  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    setUserId(storedId);
  }, [pathname]); // ページ遷移するたびに再チェック

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition">
            <FiBox className="text-xl" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">売買和達</h1>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <FiHome className="text-xl" />
            <span className="text-[10px] font-bold">ホーム</span>
          </Link>
          
          {/* ログインしていれば「マイページ」、していなければ「ログイン」を表示 */}
          {userId ? (
            <Link href="/mypage" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
              <FiUser className="text-xl" />
              <span className="text-[10px] font-bold">マイページ</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
              <FiLogIn className="text-xl" />
              <span className="text-[10px] font-bold">ログイン</span>
            </Link>
          )}

          <Link href="/sell" className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <FiCamera className="mr-2" />
            出品する
          </Link>
        </div>
      </div>
    </nav>
  );
}