"use client";

import React, { useState } from "react";

const Page: React.FC = () => {
  const [alcoholType, setAlcoholType] = useState<string>('');
  const [dishName, setDishName] = useState<string>('');
  const [dishImage, setDishImage] = useState<File>();
  const [pairingResult, setPairingResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDishImage(e.target.files[0]);
    }
  };

  const handlePairingStart = async () => {
    if (!alcoholType || (!dishName && !dishImage)) {
      setPairingResult('お酒の種類を選択後、料理名または料理の画像を入力してください。');
      return;
    }

    // formDataへdishName, dishImageを追加
    const formData = new FormData(); 
    formData.append('text', `お酒の種類: ${alcoholType}, 料理: ${dishName || '画像あり'}. このお酒と料理の最適なペアリングを提案してください。お酒の名前と特徴を含めてください。`);
    if (dishImage) {
      formData.append('image', dishImage);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini-api', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setPairingResult(data.message);
    } catch (error) {
      console.error('Error:', error);
      setPairingResult('ペアリング結果の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-shippori-mincho text-black">
      <h1 className="text-4xl text-center py-8 font-bold">日本独自のお酒ペアリングサービス</h1>
      
      <div className="w-full mb-8">
        <img src="https://ucarecdn.com/7b55e7c7-48d7-4d6f-9770-a97404b6be5e/-/format/auto/" alt="日本酒を優雅に注ぐ様子" className="w-full object-cover" />
      </div>
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <label className="block mb-2 text-lg">お酒の種類:</label>
          <div className="flex space-x-4">
            <button 
              onClick={() => setAlcoholType('日本酒')} 
              className={`flex-1 p-6 border border-black rounded text-2xl ${alcoholType === '日本酒' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}
            >
              <img src="https://ucarecdn.com/36a9eb2f-1e17-4c98-82ac-92271019967a/-/format/auto/" alt="日本酒ロゴ" className="w-12 h-12 mr-3" />
              日本酒
            </button>
            <button 
              onClick={() => setAlcoholType('缶チューハイ')} 
              className={`flex-1 p-6 border border-black rounded text-2xl ${alcoholType === '缶チューハイ' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}
            >
              <img src="https://ucarecdn.com/50b2302e-507c-4a80-9dc5-19fcdf8d1f5c/-/format/auto/" alt="缶チューハイロゴ" className="w-12 h-12 mr-3" />
              缶チューハイ
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-lg">料理名:</label>
          <input type="text" name="dishName" onChange={(e) => setDishName(e.target.value)} value={dishName} className="w-full p-2 border border-gray-300 rounded bg-white" />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-lg">料理の画像:</label>
          <input type="file" name="dishImage" onChange={handleImageUpload} accept="image/*" className="w-full p-2 border border-gray-300 rounded bg-white" />
        </div>
        
        <button onClick={handlePairingStart} disabled={isLoading} className="w-full bg-black text-white mb-8 py-3 rounded hover:bg-gray-800 transition duration-300">
          {isLoading ? 'ペアリング中...' : 'ペアリングスタート'}
        </button>
        
        {pairingResult && (
          <div className="mb-8 p-4 border border-gray-300 rounded bg-white">
            <h2 className="text-2xl mb-4">ペアリング結果</h2>
            <p className="whitespace-pre-wrap">{pairingResult}</p>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap');
        .font-shippori-mincho {
          font-family: 'Shippori Mincho', serif;
        }
      `}</style>
    </div>
  );
};

export default Page;
