
import React from 'react';
import { ViewType } from '../types';
import { LayoutDashboard, BookOpen, PenTool, Image, ScrollText, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: '工作室总览', icon: LayoutDashboard },
    { id: ViewType.LIBRARY, label: '提示词库', icon: BookOpen },
    { id: ViewType.BUILDER, label: '提示词生成器', icon: PenTool },
    { id: ViewType.ANALYZER, label: 'UI 风格解析', icon: Image },
    { id: ViewType.METHODOLOGIES, label: '我的方法论', icon: ScrollText },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col p-4 shadow-sm z-10">
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Sparkles size={20} />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-800">UIForge</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-2xl">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">专业版功能</p>
        <p className="text-sm text-slate-600 mb-3">使用 AI 无限制解析 UI 截图。</p>
        <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors">
          立即升级
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
