'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// ★修正: FiHeart を追加
import { FiLogOut, FiBox, FiHeart } from 'react-icons/fi';

export default function MyPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const router = useRouter();
  
  // 自分の出品した商品
  const [items, setItems] = useState<any[]>([]);
  // ★追加: 自分がいいねした商品
  const [likedItems, setLikedItems] = useState<any[]>([]);
  
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

    // 1. 自分の出品商品を取得
    fetch(`${API_URL}/api/users/${storedId}/items`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    // ★追加: 2. いいねした商品を取得
    fetch(`${API_URL}/api/users/${storedId}/likes`)
      .then(res => res.json())
      .then(data => setLikedItems(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    alert("ログアウトしました");
    router.push('/');
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">マイページ</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut className="mr-2" /> ログアウト
          </button>
        </div>

        {/* --- エリア1: あなたの出品した商品 --- */}
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiBox className="mr-2" /> あなたの出品した商品
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl text-gray-400 border border-dashed border-gray-200">
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
                    {item.status === 'sold' && (
                        <div className="absolute top-1/2 left-0 w-full bg-red-600/90 text-white text-center font-bold py-1 transform -translate-y-1/2 text-sm">SOLD</div>
                    )}
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

        {/* --- ★追加エリア: いいねした商品 --- */}
        <h2 className="text-xl font-bold mb-4 mt-12 flex items-center text-pink-500">
          <FiHeart className="mr-2" /> いいねした商品
        </h2>
        
        {likedItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl text-gray-400 border border-dashed border-gray-200">
            まだいいねした商品がありません
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedItems.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-pink-100">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img 
                      src={item.image_data || `https://picsum.photos/300?random=${item.id}`} 
                      className="w-full h-full object-cover"
                    />
                    {item.status === 'sold' && (
                        <div className="absolute top-1/2 left-0 w-full bg-red-600/90 text-white text-center font-bold py-1 transform -translate-y-1/2 text-sm">SOLD</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm truncate">{item.title}</p>
                    <p className="font-extrabold text-sm text-pink-600">¥{item.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* --- 追加エリアここまで --- */}

      </div>
    </div>
  );
}