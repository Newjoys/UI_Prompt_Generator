
import React, { useState } from 'react';
import { Upload, Loader2, Wand2, CheckCircle2, Info } from 'lucide-react';
import { analyzeUIStyle } from '../services/geminiService';
import { Methodology } from '../types';

interface AnalyzerProps {
  onSaveMethodology: (m: Methodology) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onSaveMethodology }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeUIStyle(image);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert('解析失败，请检查 API 密钥设置。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveResults = () => {
    if (!result || !image) return;
    const newMethod: Methodology = {
      id: Math.random().toString(36).substr(2, 9),
      name: `研究报告：${result.visualStyle.split(' ')[0]} 设计`,
      imageUrl: image,
      analysis: result,
      createdAt: Date.now()
    };
    onSaveMethodology(newMethod);
    alert('方法论已保存至您的存档！');
    setResult(null);
    setImage(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900">风格解析器</h2>
        <p className="text-slate-500 mt-2">上传 UI 截图，让 AI 将其拆解为可复用的设计方法论。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all min-h-[400px] ${
            image ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            {image ? (
              <img src={image} alt="预览" className="max-h-80 w-full object-contain rounded-xl shadow-lg mb-6" />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Upload size={24} />
                </div>
                <p className="font-medium text-slate-700">拖拽设计截图到此处</p>
                <p className="text-sm text-slate-400 mt-1">支持 PNG, JPG，最大 10MB</p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="mt-4 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
            >
              {image ? '更换图片' : '选择文件'}
            </label>
          </div>

          {image && !result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  正在深度拆解设计模式...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  提取设计方法论
                </>
              )}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
              <Info className="text-blue-500 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1 text-sm">运行原理</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  我们的视觉模型会分析布局层级、色彩和谐度、字体选择以及风格细微差别，为你未来的项目构建逻辑蓝图。
                </p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-lg w-1/3"></div>
              <div className="h-32 bg-slate-100 rounded-2xl"></div>
              <div className="h-32 bg-slate-100 rounded-2xl"></div>
              <div className="h-32 bg-slate-100 rounded-2xl"></div>
            </div>
          )}

          {result && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" />
                  已提取设计精髓
                </h3>
                <button 
                  onClick={saveResults}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  保存到存档
                </button>
              </div>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">视觉风格</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-slate-100">
                  {result.visualStyle}
                </p>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">配色方案 (调色盘)</h4>
                <div className="flex gap-2">
                  {result.colorPalette.map((color: string) => (
                    <div key={color} className="group relative">
                      <div 
                        className="w-12 h-12 rounded-full border border-slate-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">核心原则与步骤</h4>
                <ul className="space-y-2">
                  {result.methodologySteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-600 items-start">
                      <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
