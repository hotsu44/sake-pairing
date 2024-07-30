"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

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
      setPairingResult('After selecting the type of alcoholic beverage, please enter the name of the dish or a picture of the dish.');
      scrollToElement("#pairngResult");
      return;
    }

    // formDataへdishName, dishImageを追加
    const formData = new FormData(); 
    formData.append('text', `お酒の種類: ${alcoholType}, 料理: ${dishName || '画像あり'}. このお酒と料理の最適なペアリングを提案してください。必ず お酒の個別名 特徴 ペアリング理由をそれぞれ4つ出力。必ず全文を英語で出力してください。`);
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
      let responseText = data.message.replace("/\*/g", "");
      setPairingResult(responseText);
      scrollToElement("#pairngResult");
    } catch (error) {
      console.error('Error:', error);
      setPairingResult('ペアリング結果の取得に失敗しました。');
      scrollToElement("#pairngResult");
    } finally {
      setIsLoading(false);
    }

    
  };

  const scrollToElement = (id: string) => {
    // 表示されたDomにスクロールするため30msをあける
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 30);
  };

  const YozakuraJP_title: React.CSSProperties = {
    fontFamily: 'YozakuraJP',
    letterSpacing: '0.3em'
  };
  const YozakuraJP_subTitle: React.CSSProperties = {
    fontFamily: 'YozakuraJP',
  };

  return (
    <div className="bg-white min-h-screen font-shippori-mincho text-black">
      <h1 className="text-5xl text-center pt-8 font-bold"><span style={YozakuraJP_title}>SAKE PAIRING</span></h1>
      <p className="text-center text-xl mb-8 mt-4" style={YozakuraJP_subTitle}>Sake and chuhai food pairing service</p>
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="w-full mb-8">
          <img src="https://ucarecdn.com/a8a694aa-b6b4-49c8-ac3b-c415ca7a2d9e/-/format/auto/" alt="日本酒とチューハイのイラスト" className="w-full object-cover" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-lg">Step1: Select the type of alcohol</label>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => setAlcoholType('日本酒')} 
              className={`p-6 border border-black rounded text-2xl ${alcoholType === '日本酒' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center justify-center`}
            >
              <div className="flex items-center mb-2">
                <img src="https://ucarecdn.com/36a9eb2f-1e17-4c98-82ac-92271019967a/-/format/auto/" alt="日本酒ロゴ" className="w-24 h-24 mr-3" />
                <span>Sake</span>
              </div>
              <p className="text-sm mt-2">Traditional Japanese sake made with rice. Characterized by its rich aroma and deep flavor.</p>
            </button>
            <button 
              onClick={() => setAlcoholType('チューハイ')} 
              className={`p-6 border border-black rounded text-2xl ${alcoholType === 'チューハイ' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center justify-center`}
            >
              <div className="flex items-center mb-2">
                <img src="https://ucarecdn.com/50b2302e-507c-4a80-9dc5-19fcdf8d1f5c/-/format/auto/" alt="チューハイロゴ" className="w-24 h-24 mr-3" />
                <span>Chuhai</span>
              </div>
              <p className="text-sm mt-2">Easy alcoholic beverage with a fruity taste and refreshing sensation.</p>
            </button>
          </div>
        </div>
        
        <div className="mb-2">
          <label className="block mb-2 text-lg">Step2: Attach the dish name or a picture of it.</label>
          <input type="text" name="dishName" onChange={(e) => setDishName(e.target.value)} value={dishName} className="w-full p-2 border border-gray-300 rounded bg-white"  placeholder="the dish name" />
        </div>
        
        <div className="mb-8">
          <label className="block mb-2 text-lg">Dish picture:</label>
          <input type="file" name="dishImage" onChange={handleImageUpload} accept="image/*" className="w-full p-2 border border-gray-300 rounded bg-white" />
        </div>
        
        <button onClick={handlePairingStart} disabled={isLoading} className="w-full bg-black text-white mb-8 py-3 rounded text-2xl hover:bg-gray-800 transition duration-300">
          {isLoading ? 'Pairing in progress...' : 'Start pairing'}
        </button>
        
        <div id="#pairngResult">
          {pairingResult && (
            <div className="mb-8 p-4 border border-gray-300 rounded bg-white">
              <h2 className="text-2xl mb-4">Pairing Result</h2>
              <p className="whitespace-pre-wrap"><ReactMarkdown>{pairingResult}</ReactMarkdown></p>
            </div>
          )}
        </div>
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
