'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// アイコンを追加
import { FiClock, FiStar } from 'react-icons/fi';

export default function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ★追加: 現在のタブ状態 ('new' か 'recommend' か)
  const [activeTab, setActiveTab] = useState<'new' | 'recommend'>('new');

  useEffect(() => {
    // タブが切り替わるたびにローディングを出して再取得
    setLoading(true);
    
    // ★修正: クエリパラメータ(?sort=...)をつけてAPIを叩く
    fetch(`${API_URL}/api/items?sort=${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setItems([]);
      })
      .catch((err) => console.error("通信エラー:", err))
      .finally(() => setLoading(false));
  }, [activeTab]); // ← activeTabが変わるたびに実行される

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">
            {activeTab === 'new' ? '新着商品を読み込み中...' : 'あなたへのおすすめを選定中...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600 mb-1">売買和達</h1>
            <p className="text-gray-500 text-sm">AIが支える、次世代のフリマ体験</p>
          </div>
          <Link href="/sell" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition hover:-translate-y-1">
            出品する
          </Link>
        </div>

        {/* ★追加: 切り替えタブボタン */}
        <div className="flex items-center space-x-4 mb-6">
            <button 
                onClick={() => setActiveTab('new')}
                className={`px-6 py-3 rounded-full font-bold transition flex items-center ${
                    activeTab === 'new' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
            >
                <FiClock className="mr-2"/> 新着アイテム
            </button>
            
            <button 
                onClick={() => setActiveTab('recommend')}
                className={`px-6 py-3 rounded-full font-bold transition flex items-center ${
                    activeTab === 'recommend' 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md' 
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
            >
                <FiStar className="mr-2"/> あなたへのおすすめ
            </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
            商品が見つかりませんでした。
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {items.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img 
                      src={item.image_data ? item.image_data : `https://picsum.photos/500?random=${item.id}`} 
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${item.status === 'sold' ? 'opacity-60 grayscale' : ''}`}
                    />
                    {item.status === 'sold' && (
                      <div className="absolute top-1/2 left-0 w-full bg-red-600/90 text-white text-center font-extrabold py-1 transform -translate-y-1/2 tracking-widest text-lg shadow-md z-10">
                        SOLD
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                    {/* カテゴリ名を表示 */}
                    <p className="text-gray-500 text-xs mb-1 bg-gray-100 inline-block px-2 py-1 rounded">
                        {item.category_name || "未分類"}
                    </p>
                    <div className="flex justify-between items-end border-t pt-3 border-gray-100 mt-2">
                      <span className="text-xl font-extrabold text-gray-900">¥{item.price.toLocaleString()}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">詳細 &gt;</span>
                    </div>
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