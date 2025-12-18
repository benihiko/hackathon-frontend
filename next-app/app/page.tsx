'use client';

import { useState, useRef } from 'react';
import { FiCamera, FiBox, FiCheckCircle, FiAlertTriangle, FiSearch } from 'react-icons/fi';

export default function Home() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // 画像ファイル管理
  
  // AIの結果管理
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // AI承認済みフラグ

  const fileInputRef = useRef<HTMLInputElement>(null);

  // AIチェック実行
  const runAiCheck = async () => {
    if (!title || !desc) return;
    setLoading(true);
    setAiResult(null);
    setIsVerified(false);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai/analyze_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: title, item_description: desc }),
      });

      if (!res.ok) throw new Error('サーバーエラー');
      const data = await res.json();
      
      setAiResult(data);
      // AIが is_valid: true を出したら出品ボタンを有効化
      if (data.is_valid) {
        setIsVerified(true);
      }
    } catch (err: any) {
      setAiResult({ is_valid: false, reason: `通信エラー: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // 画像選択処理
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // ここでAIチェックをリセットする（内容が変わったため）
      setIsVerified(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* ヘッダー */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <FiBox className="text-xl" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">売買和達</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition">
              出品する
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 左カラム：入力フォーム */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                商品の情報を入力
              </h2>

              <div className="space-y-6">
                {/* 画像アップロード (機能実装済み) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">商品画像</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div 
                    onClick={handleImageClick}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${imageFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    {imageFile ? (
                      <div className="text-center">
                        <FiCheckCircle className="text-3xl text-blue-500 mb-2 mx-auto" />
                        <span className="text-sm font-bold text-blue-700">{imageFile.name}</span>
                        <p className="text-xs text-gray-500">変更するにはクリック</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <FiCamera className="text-3xl mb-2 mx-auto" />
                        <span className="text-xs font-bold">クリックして画像をアップロード</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 入力欄 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">商品名</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setIsVerified(false); }}
                    placeholder="例: NiziU 彩花 トレカ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">商品説明</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 h-40 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    value={desc}
                    onChange={(e) => { setDesc(e.target.value); setIsVerified(false); }}
                    placeholder="詳細を入力してください..."
                  />
                </div>

                {/* AIチェックボタン */}
                <button 
                  onClick={runAiCheck}
                  disabled={loading || !title || !desc}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
                >
                  {loading ? 'AIが審査中...' : 'AI審査を実行する'}
                </button>
              </div>
            </div>
          </div>

          {/* 右カラム：AIゲートキーパー結果 */}
          <div className="md:col-span-1">
            <div className={`sticky top-24 transition-all duration-500`}>
              {/* レポートカード */}
              <div className={`rounded-2xl shadow-xl p-6 relative overflow-hidden text-white transition-colors duration-500 ${
                !aiResult ? 'bg-gray-800' : 
                aiResult.is_valid ? 'bg-gradient-to-br from-green-600 to-emerald-700' : 
                'bg-gradient-to-br from-red-600 to-rose-700'
              }`}>
                <h3 className="text-lg font-bold mb-4 flex items-center z-10 relative">
                  {aiResult?.is_valid ? <FiCheckCircle className="mr-2 text-2xl"/> : <FiAlertTriangle className="mr-2 text-2xl"/>}
                  AI診断レポート
                </h3>
                
                <div className="text-sm font-medium z-10 relative whitespace-pre-wrap min-h-[100px]">
                  {!aiResult ? (
                    <div className="text-gray-400 text-center py-8">
                      左のフォームを入力して<br/>審査を実行してください
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="opacity-80 text-xs uppercase mb-1">判定結果</p>
                        <p className="text-xl font-bold">{aiResult.is_valid ? "出品承認 ✅" : "出品不可 ⚠️"}</p>
                      </div>
                      <div className="mb-4">
                        <p className="opacity-80 text-xs uppercase mb-1">推奨チャンネル</p>
                        <p className="font-bold">{aiResult.suggested_channel}</p>
                      </div>
                      <div>
                        <p className="opacity-80 text-xs uppercase mb-1">AIコメント</p>
                        <p>{aiResult.reason}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 最終出品ボタン（AI承認時のみ出現） */}
              {isVerified && (
                <button className="w-full mt-4 bg-gray-900 text-white font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4">
                  出品を確定する
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}