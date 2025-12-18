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

      localStorage.setItem('userId', data.id); // ユーザーIDを保存
      alert(isRegister ? "登録成功！" : "ログイン成功！");
      router.push('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{isRegister ? '新規登録' : 'ログイン'}</h1>
        <div className="space-y-4">
          <input type="text" placeholder="ユーザー名" className="w-full bg-gray-100 p-3 rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="パスワード" className="w-full bg-gray-100 p-3 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleAuth} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">{isRegister ? '登録' : 'ログイン'}</button>
        </div>
        <p className="mt-4 text-center text-sm text-blue-600 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'ログインはこちら' : '新規登録はこちら'}</p>
      </div>
    </div>
  );
}