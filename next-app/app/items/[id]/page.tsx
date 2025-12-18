'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingBag, FiHeart } from 'react-icons/fi';

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);

  useEffect(() => {
    // 1. 商品詳細を取得
    fetch(`http://127.0.0.1:8000/api/items`)
      .then(res => res.json())
      .then(data => {
        // 全件取得してからIDで探す（ハッカソン用簡易ロジック）
        const found = data.find((i: any) => i.id == params.id);
        setItem(found);
      });

    // 2. AIレコメンド商品を取得
    fetch(`http://127.0.0.1:8000/api/items/${params.id}/related`)
      .then(res => res.json())
      .then(data => setRelatedItems(data))
      .catch(err => console.error("レコメンド取得失敗:", err));
  }, [params.id]);

  if (!item) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm">
        {/* 画像エリア (修正済み) */}
        <div className="bg-gray-200 h-96 flex items-center justify-center relative overflow-hidden">
          <Link href="/" className="absolute top-4 left-4 bg-white/80 p-3 rounded-full shadow-sm hover:bg-white transition z-10">
            <FiArrowLeft className="text-xl"/>
          </Link>
          
          {/* ここを変更：画像データがあれば表示、なければPicsum */}
          <img 
            src={item.image_data ? item.image_data : `https://picsum.photos/600?random=${item.id}`} 
            alt={item.title} 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            {item.status === 'sold' && <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">SOLD</span>}
          </div>
          
          <p className="text-gray-500 text-sm mb-6 flex items-center">
            <span className="bg-gray-100 px-2 py-1 rounded mr-2">カテゴリ</span>
            {item.category_code || "未分類"}
          </p>

          <div className="text-4xl font-extrabold text-gray-900 mb-8">¥{item.price.toLocaleString()}</div>
          
          <div className="bg-gray-50 p-6 rounded-xl mb-10 border border-gray-100">
            <h3 className="font-bold mb-2 text-gray-700">商品説明</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          <div className="flex space-x-4 mb-16">
            <button className="flex-1 bg-red-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition flex items-center justify-center transform hover:scale-[1.02]">
              <FiShoppingBag className="mr-2 text-xl" /> 購入手続きへ
            </button>
            <button className="bg-gray-100 p-4 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition shadow-sm border border-gray-200">
              <FiHeart className="text-2xl" />
            </button>
          </div>

          {/* --- AIレコメンドエリア --- */}
          <div className="border-t pt-10">
            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              <span className="text-2xl mr-2">🤖</span>
              この商品を見ている人におすすめ
            </h3>
            {relatedItems.length === 0 ? (
              <p className="text-gray-400 text-sm">関連商品は見つかりませんでした</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedItems.map((relItem) => (
                  <Link href={`/items/${relItem.id}`} key={relItem.id} className="block group">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition cursor-pointer">
                      <div className="h-40 bg-gray-200 overflow-hidden">
                         <img 
                            src={relItem.image_data ? relItem.image_data : `https://picsum.photos/300?random=${relItem.id}`} 
                            alt={relItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm truncate text-gray-900">{relItem.title}</p>
                        <p className="text-gray-900 font-extrabold text-sm mt-1">¥{relItem.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}