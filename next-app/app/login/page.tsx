'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// ★修正: FiEye, FiEyeOff を追加
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // ★追加: パスワード表示状態
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? '/api/register' : '/api/login';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userId', data.id);
        alert(isRegister ? "登録完了しました！" : "ログインしました！");
        router.push('/');
      } else {
        alert(data.detail || "エラーが発生しました");
      }
    } catch (err) {
      alert("通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
        
        {/* ロゴ・タイトル */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <h1 className="text-3xl font-black text-white tracking-tighter">売買和達</h1>
          </div>
          <p className="text-gray-500 font-medium">
            {isRegister ? '新しいアカウントを作成しましょう' : 'おかえりなさい！ログインしてください'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ユーザー名入力 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">ユーザー名</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition">
                <FiUser />
              </div>
              <input
                type="text"
                placeholder="ユーザー名を入力"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition group-hover:border-gray-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">パスワード</label>
            <div className="relative group">
              {/* 左側の鍵アイコン */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition">
                <FiLock />
              </div>
              
              {/* 入力欄本体 (右側にアイコン分の余白 pr-12 を追加) */}
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="パスワードを入力"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition group-hover:border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* ★追加: 表示/非表示切り替えボタン */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // タブ移動でスキップさせる
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                送信中...
              </span>
            ) : (
              isRegister ? 'アカウントを作成' : 'ログイン'
            )}
          </button>
        </form>

        {/* モード切り替え */}
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-sm">
            {isRegister ? 'すでにアカウントをお持ちですか？' : 'まだアカウントをお持ちではありませんか？'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-blue-600 font-bold hover:underline"
            >
              {isRegister ? 'ログインはこちら' : '今すぐ新規登録'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}