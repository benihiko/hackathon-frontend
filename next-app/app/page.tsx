'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setItems([]);
      })
      .catch((err) => console.error("通信エラー:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600 mb-1">売買和達</h1>
            <p className="text-gray-500 text-sm">AIが支える、次世代のフリマ体験</p>
          </div>
          <Link href="/sell" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition hover:-translate-y-1">
            出品する
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
          新着アイテム
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
            まだ商品がありません。右上のボタンから出品してみましょう！
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id} className="block group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {/* アップロード画像があれば優先、なければPicsum */}
                    <img 
                      src={item.image_data ? item.image_data : `https://picsum.photos/500?random=${item.id}`} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 h-8 mb-3">{item.description}</p>
                    <div className="flex justify-between items-end border-t pt-3 border-gray-100">
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