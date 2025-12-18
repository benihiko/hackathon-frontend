'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!username || !password) return;
    const endpoint = isRegister ? '/api/register' : '/api/login';
    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      localStorage.setItem('userId', data.id);
      alert(isRegister ? "登録成功！" : "ログイン成功！");
      router.push('/');
    } catch (err: any) {
      alert(err.message || "エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          {isRegister ? '新規登録' : 'ログイン'}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ユーザー名</label>
            <input 
              type="text" 
              placeholder="ユーザー名を入力" 
              className="w-full bg-gray-100 border border-gray-200 p-3 rounded-lg text-black focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">パスワード</label>
            <input 
              type="password" 
              placeholder="パスワードを入力" 
              className="w-full bg-gray-100 border border-gray-200 p-3 rounded-lg text-black focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            onClick={handleAuth} 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-2"
          >
            {isRegister ? '登録してはじめる' : 'ログインする'}
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-blue-600 cursor-pointer hover:underline font-medium"
           onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'すでにアカウントをお持ちの方はこちら' : 'アカウント作成はこちら'}
        </p>
      </div>
    </div>
  );
}