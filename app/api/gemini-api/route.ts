import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const prompt_text = formData.get('text') as string;
    const image_file = formData.get('image') as File;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (image_file) {
        // 画像をBase64エンコード
        const imageBytes = await image_file.arrayBuffer();
        const base64Image = Buffer.from(imageBytes).toString('base64');
        const result = await model.generateContent([
            prompt_text,
            {
                inlineData: {
                    mimeType: image_file.type,
                    data: base64Image
                }
            }
        ]);
        const response = await result.response;
        return NextResponse.json({
            message: response.text()
        });
    } else {
        const result = await model.generateContent(prompt_text)
        const response = await result.response;
        return NextResponse.json({
            message: response.text()
        });
    }
}