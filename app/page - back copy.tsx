"use client";

import React, { useState } from "react";

const Page: React.FC = () => {
  const [input, setInput] = useState<string>(""); // textareaの入力を格納
  const [geminiResponse, setGeminiResponse] = useState<string>(""); // geminiの返答を格納するstate

  const systemInstruction =
    "以下の文章の誤字脱字を修正して修正後の文章を出力して下さい。";
  const prompt = systemInstruction + "\n\n" + input;
  const Gemini = () => {
    const postData = async () => {
      const response = await fetch("/api/gemini-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt_post: prompt }), //promptに入力する文字を入れる
      });
      console.log(response);
      const data = await response.json();
      setGeminiResponse(data.message);
    };
    postData();
  };

  return (
    <div className="container mx-auto px-4">
      <h1>誤字脱字を修正します。</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-40 p-4 border border-gray-300 rounded-md"
      />
      <input type="file" accept="image/png, image/jpeg, image/jpg"></input>
      <button
        onClick={Gemini}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        実行
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <p className="text-left">Output:</p>
        <p>{geminiResponse}</p>
      </div>
    </div>
  );
};

export default Page;
