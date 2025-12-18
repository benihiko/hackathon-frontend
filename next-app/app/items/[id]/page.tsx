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
    fetch(`http://127.0.0.1:8000/api/items`) // 本来は個別取得APIを作るべきですが、ハッカソンなので全件から探します
      .then(res => res.json())
      .then(data => {
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm">
        {/* 画像エリア */}
        <div className="bg-gray-200 h-80 flex items-center justify-center relative">
          <Link href="/" className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-sm hover:bg-white transition">
            <FiArrowLeft className="text-xl"/>
          </Link>
          <span className="text-gray-400 font-bold text-2xl">No Image</span>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
          <p className="text-gray-500 text-sm mb-4">{item.merrec_category}</p>
          <div className="text-3xl font-bold text-red-500 mb-6">¥{item.price.toLocaleString()}</div>
          
          <p className="text-gray-700 leading-relaxed mb-8 bg-gray-50 p-4 rounded-lg">
            {item.description}
          </p>

          <div className="flex space-x-4 mb-12">
            <button className="flex-1 bg-red-500 text-white font-bold py-4 rounded-full shadow-md hover:bg-red-600 transition flex items-center justify-center">
              <FiShoppingBag className="mr-2" /> 購入手続きへ
            </button>
            <button className="bg-gray-100 p-4 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition">
              <FiHeart className="text-2xl" />
            </button>
          </div>

          {/* --- ここがAIレコメンドエリア --- */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AIが選んだおすすめ商品
            </h3>
            {relatedItems.length === 0 ? (
              <p className="text-gray-400 text-sm">関連商品は見つかりませんでした</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedItems.map((relItem) => (
                  <Link href={`/items/${relItem.id}`} key={relItem.id} className="block group">
                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition">
                      <div className="h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Image</div>
                      <div className="p-3">
                        <p className="font-bold text-sm truncate">{relItem.title}</p>
                        <p className="text-red-500 font-bold text-xs mt-1">¥{relItem.price.toLocaleString()}</p>
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