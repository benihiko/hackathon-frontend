'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiHome, FiMessageCircle } from 'react-icons/fi';

export default function TransactionPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // 購入完了直後なので、念のため少し待つか、即座に取得
    fetch(`${API_URL}/api/items/${params.id}/transaction`)
      .then(res => {
        if (!res.ok) throw new Error("データ取得エラー");
        return res.json();
      })
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, [params.id]);

  if (!data) return <div className="p-10 text-center">取引情報を読み込んでいます...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="bg-green-600 p-8 text-center text-white">
        <FiCheckCircle className="text-6xl mx-auto mb-4"/>
        <h1 className="text-3xl font-bold">購入が完了しました！</h1>
        <p className="opacity-90 mt-2">出品者への支払いが完了しました。発送をお待ちください。</p>
      </div>

      <div className="max-w-2xl mx-auto -mt-6 px-4">
        {/* 商品情報カード */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                    src={data.item.image_data || `https://picsum.photos/300?random=${data.item.id}`} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">{data.item.title}</h2>
                <p className="text-gray-500 text-sm mb-2">出品者: {data.seller_name}</p>
                <div className="text-xl font-extrabold">¥{data.item.price.toLocaleString()}</div>
            </div>
        </div>

        {/* 取引メッセージ（モック） */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center">
                <FiMessageCircle className="mr-2 text-blue-600"/> 取引メッセージ
            </h3>
            
            <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="bg-gray-100 p-3 rounded-r-xl rounded-bl-xl text-sm">
                        <p className="font-bold text-xs text-gray-500 mb-1">システム</p>
                        <p>取引が開始されました。出品者からの連絡をお待ちください。</p>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2">
                <input type="text" placeholder="メッセージを送信..." className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">送信</button>
            </div>
        </div>

        <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-bold">
                <FiHome className="mr-2"/> ホームに戻る
            </Link>
        </div>
      </div>
    </div>
  );
}