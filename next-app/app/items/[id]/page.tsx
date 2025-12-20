'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// ★追加: FiHeart などをインポート
import { FiArrowLeft, FiShoppingBag, FiHeart, FiUser, FiRss } from 'react-icons/fi';

export default function ItemDetailPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const params = useParams();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  // ★追加: ユーザー状態管理
  const [userId, setUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true); // 読み込み状態用
  const [isFollowing, setIsFollowing] = useState(false); // ★追加

  useEffect(() => {
    // ★追加: ユーザーIDを取得
    const storedId = localStorage.getItem('userId');
    setUserId(storedId);

    // 1. 商品詳細を取得
    fetch(`${API_URL}/api/items`)
      .then(res => res.json())
      .then(data => {
        // 全件取得してからIDで探す（ハッカソン用簡易ロジック）
        const found = data.find((i: any) => i.id == params.id);
        setItem(found);
      })
      .catch(err => console.error("商品取得エラー:", err))
      .finally(() => setLoading(false)); // 読み込み完了

    // 2. AIレコメンド商品を取得
    fetch(`${API_URL}/api/items/${params.id}/related`)
      .then(res => res.json())
      .then(data => setRelatedItems(data))
      .catch(err => console.error("レコメンド取得失敗:", err));

    // ★追加: ログイン時のみ実行する処理
    if (storedId) {
      const uId = parseInt(storedId);

      // (A) いいね済みかチェック
      fetch(`${API_URL}/api/users/${storedId}/likes`)
        .then(res => res.json())
        .then(data => {
          const found = data.find((d: any) => d.id == params.id);
          if (found) setIsLiked(true);
        });

      // (B) 閲覧履歴を送信 (AIレコメンド用)
      fetch(`${API_URL}/api/items/${params.id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uId })
      }).catch(err => console.error("閲覧履歴送信エラー:", err));
    
      fetch(`${API_URL}/api/users/${storedId}/following`)
        .then(res => res.json())
        .then((ids: number[]) => {
            // itemがロードされるのを待つ必要があるので、fetchのチェーンか
            // item && ids.includes(item.channel_id) で判定する
            // ここでは簡易的に item 取得後の useEffect 依存配列に追加して判定推奨ですが
            // 簡易実装として、ここではなく下のtoggleボタンの表示制御で工夫します
        });
    }
  }, [params.id, userId]); // userIdへの依存は維持

// itemが変わったタイミングでフォロー状態を確認するuseEffectを追加
  useEffect(() => {
    if (userId && item && item.channel_id) {
        fetch(`${API_URL}/api/users/${userId}/following`)
        .then(res => res.json())
        .then((ids: number[]) => {
            if (ids.includes(item.channel_id)) setIsFollowing(true);
        });
    }
  }, [item, userId]);

  const toggleFollow = async () => {
    if (!userId) {
        alert("フォローするにはログインが必要です");
        return;
    }
    if (!item || !item.channel_id) return;

    try {
        const res = await fetch(`${API_URL}/api/channels/${item.channel_id}/follow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: parseInt(userId) })
        });
        const data = await res.json();
        setIsFollowing(data.following);
    } catch (e) {
        console.error(e);
    }
  };

  // ★追加: いいねボタン処理
  const toggleLike = async () => {
    if (!userId) {
      alert("いいねするにはログインが必要です");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/items/${params.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });
      const data = await res.json();
      setIsLiked(data.liked);
    } catch (e) {
      console.error(e);
    }
  };

  // ★追加: 購入処理
  const handlePurchase = async () => {
    if (!userId) {
      alert("購入するにはログインが必要です");
      return;
    }
    if (!confirm("この商品を購入しますか？")) return;

    try {
      const res = await fetch(`${API_URL}/api/items/${params.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      if (res.ok) {
        router.push(`/transaction/${params.id}`);
      } else {
        const data = await res.json();
        alert(data.detail || "購入に失敗しました");
      }
    } catch (err) {
      alert("通信エラーが発生しました");
    }
  };

  // ★維持: 読み込み中のぐるぐる（スピナー）
  if (loading || !item) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* 戻るボタン */}
      <div className="p-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {/* 左側: 商品画像 */}
        <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-inner">
          <img 
            src={item.image_data || `https://picsum.photos/800?random=${item.id}`} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          {item.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white text-4xl font-black tracking-widest border-4 border-white px-6 py-2 transform -rotate-12">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* 右側: 商品情報 */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-2">
              {item.category_name || "未分類"}
            </span>
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">{item.title}</h1>
            <p className="text-3xl font-light text-gray-400">¥{item.price.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">商品説明</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="flex items-center justify-between mb-8 p-4 border border-gray-100 rounded-2xl bg-gray-50">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-md">
                    <FiRss size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-bold">出品チャンネル</p>
                    <p className="font-bold text-gray-800 text-lg">{item.channel_name || "不明なチャンネル"}</p>
                    <p className="text-xs text-gray-500">運営: {item.seller_name}</p>
                </div>
            </div>
            
             {/* フォローボタン */}
            <button 
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-full font-bold text-sm transition flex items-center ${
                    isFollowing 
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                }`}
            >
                {isFollowing ? 'フォロー中' : '＋ フォロー'}
            </button>
          </div>

          <div className="flex space-x-4 mb-16">
            {/* ★修正: 購入ボタンに処理を追加 */}
            <button 
              onClick={handlePurchase}
              disabled={item.status === 'sold'}
              className={`flex-1 py-4 rounded-full font-extrabold text-white shadow-xl transition flex items-center justify-center space-x-2 ${
                item.status === 'sold' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'
              }`}
            >
              <FiShoppingBag />
              <span>{item.status === 'sold' ? '売り切れました' : '購入手続きへ'}</span>
            </button>

            {/* ★追加: いいねボタンを実装 */}
            <button 
                onClick={toggleLike}
                className={`p-4 rounded-full transition shadow-md border flex items-center justify-center ${
                    isLiked ? 'bg-pink-50 text-pink-500 border-pink-200' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                }`}
            >
              <FiHeart className={`text-2xl ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 関連商品エリア（元のコードを維持） */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-2"></span>
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