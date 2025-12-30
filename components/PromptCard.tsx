
import React from 'react';
import { PromptItem } from '../types';
import { Copy, Tag, Calendar } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptItem;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    alert('提示词已复制到剪贴板！');
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
          {prompt.title}
        </h3>
        <button 
          onClick={copyToClipboard}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <Copy size={18} />
        </button>
      </div>
      
      <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow italic bg-slate-50 p-3 rounded-xl border border-slate-100">
        "{prompt.content}"
      </p>

      <div className="space-y-3 pt-4 border-t border-slate-50">
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Tag size={12} />
            {prompt.category}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(prompt.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
