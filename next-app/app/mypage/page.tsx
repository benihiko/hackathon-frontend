'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLogOut, FiBox } from 'react-icons/fi';

export default function MyPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // ログインチェック
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      alert("ログインしてください");
      router.push('/login');
      return;
    }
    setUserId(storedId);

    // 自分の出品商品を取得
    fetch(`http://127.0.0.1:8000/api/users/${storedId}/items`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId'); // ログアウト処理
    alert("ログアウトしました");
    router.push('/');
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">マイページ</h1>
            <p className="text-gray-500 text-sm">ユーザーID: {userId}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut className="mr-2" /> ログアウト
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiBox className="mr-2" /> あなたの出品した商品
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl text-gray-400">
            まだ出品履歴がありません
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img 
                      src={item.image_data || `https://picsum.photos/300?random=${item.id}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm truncate">{item.title}</p>
                    <p className="font-extrabold text-sm">¥{item.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}