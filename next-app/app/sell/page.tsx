'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiCamera, FiBox, FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';

export default function SellPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // ★追加
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('1000');
  
  // ★画像管理用State
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string); // Base64に変換
      };
      reader.readAsDataURL(file);
      setIsVerified(false);
    }
  };

  const runAiCheck = async () => {
    if (!title || !desc) return;
    setLoading(true);
    setAiResult(null);
    setIsVerified(false);

    try {
      const res = await fetch(`${API_URL}/api/ai/analyze_item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: title, item_description: desc }),
      });
      const data = await res.json();
      setAiResult(data);
      if (data.is_valid) setIsVerified(true);
    } catch (err: any) {
      alert("AI通信エラー: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleListing = async () => {
    if (!isVerified) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("出品するにはログインしてください");
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title, 
          description: desc,
          price: parseInt(price),
          image_data: imageData,
          user_id: parseInt(userId)

        }),
      });
      
      if (res.ok) {
        alert("出品しました！");
        router.push('/');
      }
    } catch (err) {
      alert("出品エラー");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 p-4 mb-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto font-bold flex items-center text-xl">
            <FiBox className="mr-2 text-blue-600"/> 売買和達 - 出品
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">商品の情報を入力</h2>

                {/* 画像アップロードエリア */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">商品画像</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  
                  {preview ? (
                    <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                      <button onClick={() => {setPreview(null); setImageData("");}} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-400 rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                      <FiCamera className="text-4xl mb-2"/>
                      <span className="font-bold">クリックして画像をアップロード</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">商品名</label>
                        <input className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                          value={title} onChange={e => {setTitle(e.target.value); setIsVerified(false);}} placeholder="例: 参考書"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">価格</label>
                        <input type="number" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                          value={price} onChange={e => setPrice(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">説明</label>
                        <textarea className="w-full border border-gray-300 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500" 
                          value={desc} onChange={e => {setDesc(e.target.value); setIsVerified(false);}} placeholder="詳細..."/>
                    </div>
                </div>

                <button onClick={runAiCheck} disabled={loading || !title || !desc} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-8 hover:bg-blue-700 disabled:opacity-50 transition shadow-md">
                    {loading ? 'AIが診断中...' : 'AI診断を実行'}
                </button>
            </div>
        </div>

        {/* 右カラム：診断結果 */}
        <div className="md:col-span-1">
            <div className={`sticky top-24 p-6 rounded-xl text-white transition-colors shadow-lg ${!aiResult ? 'bg-gray-800' : aiResult.is_valid ? 'bg-green-600' : 'bg-red-600'}`}>
                <h3 className="font-bold flex items-center mb-4 text-lg">
                    {aiResult?.is_valid ? <FiCheckCircle className="mr-2 text-2xl"/> : <FiAlertTriangle className="mr-2 text-2xl"/>}
                    診断レポート
                </h3>
                <div className="text-sm min-h-[100px] whitespace-pre-wrap font-medium">
                    {!aiResult ? "左のフォームを入力して診断してください" : (
                        <>
                            <div className="mb-4 text-xl font-bold border-b border-white/20 pb-2">{aiResult.is_valid ? "出品承認 ✅" : "出品不可 ⚠️"}</div>
                            <div className="mb-2"><strong>推奨:</strong> {aiResult.suggested_channel}</div>
                            <div>{aiResult.reason}</div>
                        </>
                    )}
                </div>
                
                {isVerified && (
                    <button onClick={handleListing} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl mt-6 shadow-xl hover:scale-105 transition border border-gray-700">
                        出品を確定する
                    </button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}