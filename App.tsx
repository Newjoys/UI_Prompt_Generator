
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PromptCard from './components/PromptCard';
import Builder from './components/Builder';
import Analyzer from './components/Analyzer';
import { ViewType, PromptItem, Methodology } from './types';
import { INITIAL_PROMPTS } from './constants';
import { Search, Plus, BookOpen, Heart, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to local storage (mock for this environment)
  useEffect(() => {
    const saved = localStorage.getItem('uiforge_prompts');
    if (saved) setPrompts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('uiforge_prompts', JSON.stringify(prompts));
  }, [prompts]);

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return (
          <div className="space-y-12 py-8">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">工作室总览</h2>
                <p className="text-slate-500 mt-2 text-lg">早上好！您的设计军械库正在不断壮大。</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{prompts.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">提示词数</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Heart size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{methodologies.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">方法论数</p>
                  </div>
                </div>
              </div>
            </header>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">最近收藏</h3>
                <button 
                  onClick={() => setCurrentView(ViewType.LIBRARY)} 
                  className="text-indigo-600 font-bold text-sm hover:underline"
                >
                  查看提示词库
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.slice(0, 3).map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </section>

            <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
               <div className="relative z-10 max-w-lg">
                 <h3 className="text-3xl font-bold mb-4">解构任何设计风格。</h3>
                 <p className="text-indigo-100 mb-8 text-lg leading-relaxed">
                   上传你喜欢的 UI 截图，我们的 AI 将拆解其 DNA，转化为结构化的方法论。
                 </p>
                 <button 
                  onClick={() => setCurrentView(ViewType.ANALYZER)}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl"
                >
                  开始解析
                 </button>
               </div>
               <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
               </div>
            </section>
          </div>
        );

      case ViewType.LIBRARY:
        return (
          <div className="py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">提示词库</h2>
                <p className="text-slate-500 mt-1">存档您最优秀的视觉指令。</p>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="搜索提示词或标签..."
                    className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setCurrentView(ViewType.BUILDER)}
                  className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  title="新建提示词"
                >
                  <Plus size={20} />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
              {filteredPrompts.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium">未找到匹配的提示词。</p>
                </div>
              )}
            </div>
          </div>
        );

      case ViewType.BUILDER:
        return <Builder onAddPrompt={(p) => setPrompts([p, ...prompts])} />;

      case ViewType.ANALYZER:
        return <Analyzer onSaveMethodology={(m) => setMethodologies([m, ...methodologies])} />;

      case ViewType.METHODOLOGIES:
        return (
          <div className="py-8">
            <header className="mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900">我的方法论</h2>
              <p className="text-slate-500 mt-1">从视觉研究中提取的设计蓝图。</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {methodologies.map(method => (
                <div key={method.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img src={method.imageUrl} className="w-full h-full object-cover" alt={method.name} />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <h3 className="text-white font-bold text-xl">{method.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6 flex-1">
                    <div className="flex gap-2">
                      {method.analysis.colorPalette.map(color => (
                        <div key={color} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">核心策略</h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                        {method.analysis.visualStyle}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">字体排版</h4>
                        <p className="text-xs text-slate-700 font-medium">{method.analysis.typography}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">布局逻辑</h4>
                        <p className="text-xs text-slate-700 font-medium">{method.analysis.layoutLogic}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(method.createdAt).toLocaleDateString('zh-CN')}</span>
                    <button className="text-indigo-600 text-xs font-bold hover:underline">查看完整报告</button>
                  </div>
                </div>
              ))}
              {methodologies.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <ScrollText size={24} />
                  </div>
                  <h4 className="font-bold text-slate-600">暂无存档的方法论。</h4>
                  <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">使用“风格解析”工具，将你喜欢的 UI 设计转化为可复用的设计原则。</p>
                  <button 
                    onClick={() => setCurrentView(ViewType.ANALYZER)}
                    className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"
                  >
                    前往风格解析
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 px-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setCurrentView(ViewType.BUILDER)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
          title="打开生成器"
        >
          <PenTool size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Simple icons from Lucide for App.tsx
const PenTool = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="m2 2 5 5"/><path d="m9.5 14.5 4 4"/></svg>
);

export default App;
