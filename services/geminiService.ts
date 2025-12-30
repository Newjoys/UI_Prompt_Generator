
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUIStyle = async (imageBuffer: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBuffer.split(',')[1]
            }
          },
          {
            text: "分析这张 UI 设计图并提取一套复刻该风格的方法论。请使用中文输出 JSON 格式，包含：visualStyle (视觉风格描述), colorPalette (十六进制色码列表), typography (字体建议及感觉), layoutLogic (布局逻辑), 以及 methodologySteps (复刻该设计精髓的 5 个步骤)。"
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualStyle: { type: Type.STRING },
          colorPalette: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          typography: { type: Type.STRING },
          layoutLogic: { type: Type.STRING },
          methodologySteps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["visualStyle", "colorPalette", "typography", "layoutLogic", "methodologySteps"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateRefinedPrompt = async (rawPrompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请将以下 UI 设计提示词进行专业化润色，以获得更高质量的生成效果，输出必须为中文： "${rawPrompt}"。重点关注技术细节、视觉清晰度和艺术指导。`
  });
  return response.text;
};
