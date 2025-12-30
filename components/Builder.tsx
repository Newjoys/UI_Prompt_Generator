
import React, { useState, useEffect, useRef } from 'react';
import { STICKY_NOTES } from '../constants';
import { StickyNote, PromptItem, CategoryType } from '../types';
import { 
  Plus, Wand2, Trash2, Send, Edit3, X, Info, Sparkles, 
  Layers, Layout, Palette, Code, Upload, Link as LinkIcon 
} from 'lucide-react';
import { generateRefinedPrompt } from '../services/geminiService';

interface BuilderProps {
  onAddPrompt: (p: PromptItem) => void;
}

const Builder: React.FC<BuilderProps> = ({ onAddPrompt }) => {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<StickyNote[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<StickyNote> | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('uiforge_notes');
    setNotes(saved ? JSON.parse(saved) : STICKY_NOTES);
  }, []);

  const saveNotes = (updated: StickyNote[]) => {
    setNotes(updated);
    localStorage.setItem('uiforge_notes', JSON.stringify(updated));
  };

  const toggleNote = (note: StickyNote) => {
    if (note.category === '公式') {
      if (customInput && !confirm('是否套用此公式并清空当前编辑器内容？')) {
        setCustomInput(prev => prev + '\n' + note.value);
      } else {
        setCustomInput(note.value);
      }
      return;
    }

    if (selectedNotes.find(n => n.id === note.id)) {
      setSelectedNotes(selectedNotes.filter(n => n.id !== note.id));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const handleAddOrEditNote = () => {
    if (!editingNote?.label || !editingNote?.value || !editingNote?.category) return;
    
    // Split input by newlines or commas
    const urlsFromInput = imageUrlInput.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
    const finalUrls = [...(editingNote.imageUrls || []), ...urlsFromInput];
    // Remove duplicates
    const uniqueUrls = Array.from(new Set(finalUrls));
    
    let updated: StickyNote[];
    if (editingNote.id) {
      updated = notes.map(n => n.id === editingNote.id ? ({ ...editingNote, imageUrls: uniqueUrls } as StickyNote) : n);
    } else {
      const newNode: StickyNote = {
        ...(editingNote as StickyNote),
        id: Math.random().toString(36).substr(2, 9),
        imageUrls: uniqueUrls
      };
      updated = [...notes, newNode];
    }
    
    saveNotes(updated);
    setIsModalOpen(false);
    setEditingNote(null);
    setImageUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditingNote(prev => ({
          ...prev,
          imageUrls: [...(prev?.imageUrls || []), base64]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setEditingNote(prev => ({
      ...prev,
      imageUrls: prev?.imageUrls?.filter((_, i) => i !== index)
    }));
  };

  const openEditModal = (note: Partial<StickyNote>) => {
    setEditingNote(note);
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleRefine = async () => {
    const pieces = selectedNotes.map(n => n.value);
    if (customInput) pieces.push(customInput);
    const raw = pieces.join(', ');
    if (!raw) return;

    setIsRefining(true);
    try {
      const refined = await generateRefinedPrompt(raw);
      setCustomInput(refined || raw);
      setSelectedNotes([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveToLibrary = () => {
    const pieces = selectedNotes.map(n => n.value);
    if (customInput) pieces.push(customInput);
    const content = pieces.join(', ');
    if (!content) return;
    
    const newPrompt: PromptItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: content.split(',')[0].substring(0, 30) + (content.length > 30 ? '...' : ''),
      content,
      tags: selectedNotes.map(n => n.category),
      category: '生成作品',
      createdAt: Date.now()
    };
    
    onAddPrompt(newPrompt);
    setSelectedNotes([]);
    setCustomInput('');
    alert('已成功保存至您的库！');
  };

  const getCategoryStyles = (cat: CategoryType) => {
    switch(cat) {
      case '公式': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300';
      case '视觉风格': return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300';
      case '布局结构': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
      case '配色氛围': return 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300';
      case '技术细节': return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300';
      default: return 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200';
    }
  };

  const categories: { type: CategoryType, icon: any }[] = [
    { type: '公式', icon: Layers },
    { type: '视觉风格', icon: Sparkles },
    { type: '布局结构', icon: Layout },
    { type: '配色氛围', icon: Palette },
    { type: '技术细节', icon: Code }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Sparkles className="text-indigo-600" size={32} />
            提示词实验室 Pro
          </h2>
          <p className="text-slate-500 font-medium mt-1">组合原子化设计配料，构建精准的 UI 生成方案。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Ingredient Bank */}
        <div className="xl:col-span-8 space-y-6">
          {categories.map(({ type, icon: Icon }) => (
            <div key={type} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${type === '公式' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Icon size={14} />
                  </div>
                  {type}
                </h3>
                <button 
                  onClick={() => openEditModal({ category: type })}
                  className="flex items-center gap-1.5 text-[11px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest bg-indigo-50/50 px-3 py-1.5 rounded-xl"
                >
                  <Plus size={14} /> 新增
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {notes.filter(n => n.category === type).map(note => {
                  const isSelected = selectedNotes.some(s => s.id === note.id);
                  return (
                    <div key={note.id} className="relative group">
                      <button
                        onClick={() => toggleNote(note)}
                        className={`px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all border shadow-sm flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-900/10' 
                            : getCategoryStyles(type)
                        }`}
                      >
                        {note.label}
                      </button>

                      {/* Hover Preview Tooltip */}
                      {note.imageUrls && note.imageUrls.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none scale-90 group-hover:scale-100 origin-bottom overflow-hidden">
                          <div className={`grid gap-2 mb-3 ${note.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {note.imageUrls.slice(0, 4).map((url, i) => (
                              <img key={i} src={url} className={`w-full h-24 object-cover rounded-xl shadow-sm ${note.imageUrls!.length === 1 ? 'h-40' : ''}`} alt="" />
                            ))}
                          </div>
                          <p className="text-xs font-black text-slate-800 mb-1">{note.label}</p>
                          <p className="text-[10px] text-slate-400 italic line-clamp-2">"{note.value}"</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
                        </div>
                      )}

                      {/* Edit Button */}
                      <button 
                        className="absolute -top-1.5 -right-1.5 p-1.5 bg-white border border-slate-200 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 hover:border-indigo-200 shadow-sm z-10"
                        onClick={(e) => { e.stopPropagation(); openEditModal(note); }}
                      >
                        <Edit3 size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Side Panel */}
        <div className="xl:col-span-4">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl sticky top-8 flex flex-col min-h-[640px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-3 tracking-tighter uppercase">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                配方组合
              </h3>
              <button 
                onClick={() => {setSelectedNotes([]); setCustomInput('');}}
                className="p-3 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 rounded-2xl"
                title="清空重置"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">挂载配料</label>
                <div className="flex flex-wrap gap-2.5 min-h-[50px] bg-slate-50/50 p-4 rounded-3xl border border-dashed border-slate-200">
                  {selectedNotes.map(note => (
                    <div key={note.id} className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-2 group animate-in slide-in-from-bottom-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                      {note.label}
                      <button onClick={(e) => { e.stopPropagation(); toggleNote(note); }} className="text-slate-500 hover:text-white transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {selectedNotes.length === 0 && (
                    <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest flex items-center h-8 ml-2 italic">等待注入标签...</div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">主体与深度细节</label>
                <textarea
                  placeholder="在此键入您的核心需求主体..."
                  className="w-full h-64 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 p-7 rounded-[2.5rem] text-sm text-slate-800 resize-none font-bold placeholder:text-slate-300 transition-all shadow-inner leading-relaxed"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-8 mt-auto border-t border-slate-50">
              <button
                onClick={handleRefine}
                disabled={isRefining || (!selectedNotes.length && !customInput)}
                className="w-full py-5 bg-indigo-50 text-indigo-700 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {isRefining ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                AI 实验室润色
              </button>
              <button
                onClick={handleSaveToLibrary}
                disabled={!selectedNotes.length && !customInput}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-indigo-100/20 disabled:opacity-50 active:scale-95"
              >
                <Send size={18} />
                保存存档
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 my-8">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-indigo-50/20">
              <div>
                <h3 className="font-black text-slate-900 text-3xl tracking-tighter">{editingNote?.id ? '编辑设计配料' : '新增设计配料'}</h3>
                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">原子化构建您的视觉指令库</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingNote(null); }} className="p-4 bg-white text-slate-400 hover:text-slate-900 rounded-3xl transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属分类</label>
                  <select 
                    className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all"
                    value={editingNote?.category}
                    onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as CategoryType })}
                  >
                    {categories.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">标签显示名称</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300"
                    placeholder="如：玻璃拟态"
                    value={editingNote?.label || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, label: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">提示词映射内容 (AI Value)</label>
                <textarea 
                  className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 h-28 resize-none shadow-inner"
                  placeholder="AI 实际执行的内容，如：frosted glass effects, blurry background..."
                  value={editingNote?.value || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, value: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">视觉示例 (支持 URL / 本地图片 / 相对链接)</label>
                  <span className="text-[9px] text-indigo-500 font-bold uppercase">支持 1-4 张</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {(editingNote?.imageUrls || []).map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group/img">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(editingNote?.imageUrls?.length || 0) < 4 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group"
                    >
                      <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[9px] font-bold mt-1 uppercase">本地上传</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <textarea 
                    className="w-full bg-indigo-50/30 border-2 border-indigo-100/50 rounded-2xl pl-12 pr-5 py-4 text-xs font-bold text-indigo-600 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-indigo-200 h-20 resize-none"
                    placeholder="粘贴图片 URL 或相对路径 (多条用回车分隔)..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={handleFileUpload}
              />
            </div>

            <div className="p-10 bg-slate-50 flex gap-6">
              <button 
                onClick={() => { setIsModalOpen(false); setEditingNote(null); }}
                className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
              >
                放弃修改
              </button>
              <button 
                onClick={handleAddOrEditNote}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-black transition-all active:scale-95"
              >
                确认并同步
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} height={size || 24} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Builder;
