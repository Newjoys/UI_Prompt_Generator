
import { PromptItem, StickyNote } from './types';

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: '1',
    title: '极简金融控制面板',
    content: '创建一个极简风格的金融应用控制面板，强调留白和高对比度排版。使用柔和的蓝色作为点缀色。',
    tags: ['SaaS', '金融', '极简'],
    category: '控制面板',
    createdAt: Date.now()
  }
];

export const STICKY_NOTES: StickyNote[] = [
  // 公式类
  { id: 'f1', label: 'UI 标准组合', value: '[主体内容], [视觉风格], [布局结构], [配色氛围], [技术细节]', category: '公式' },
  { id: 'f2', label: '极简艺术家', value: 'Minimalist [主体], high-end whitespace, [强调色] accent, refined technical details', category: '公式' },
  
  // 视觉风格 (Visual Style)
  { id: 'vs1', label: '玻璃拟态', value: 'Glassmorphism, frosted glass effects, background blur', category: '视觉风格', imageUrls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'] },
  { id: 'vs2', label: '新拟态', value: 'Neumorphism, soft UI shadows, subtle 3D extrusion', category: '视觉风格', imageUrls: ['https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=300&q=80'] },
  { id: 'vs3', label: '极简主义', value: 'Minimalist design, maximum whitespace, essentialism', category: '视觉风格', imageUrls: ['https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=300&q=80'] },
  { id: 'vs4', label: '拟物风', value: 'Skeuomorphic textures, realistic materials, tactile UI', category: '视觉风格', imageUrls: ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=300&q=80'] },
  { id: 'vs5', label: '扁平化 2.0', value: 'Flat 2.0, subtle gradients, soft depth, vibrant icons', category: '视觉风格', imageUrls: ['https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=300&q=80'] },
  
  // 布局结构 (Layout Structure)
  { id: 'ls1', label: '非对称栅格', value: 'Asymmetric grid, experimental composition', category: '布局结构' },
  { id: 'ls2', label: '层级分区', value: 'Hierarchical partitioning, clear visual logic', category: '布局结构' },
  { id: 'ls3', label: '斐波那契布局', value: 'Fibonacci ratio layout, golden ratio balance', category: '布局结构' },
  { id: 'ls4', label: '流体容器', value: 'Fluid container, dynamic responsive widths', category: '布局结构' },
  
  // 配色氛围 (Color Palette)
  { id: 'cp1', label: '单色极简', value: 'Monochromatic minimalist, shades of grey and deep indigo', category: '配色氛围' },
  { id: 'cp2', label: '高对比活力', value: 'High-contrast vibrancy, complementary bold hues', category: '配色氛围' },
  { id: 'cp3', label: '柔和粉调', value: 'Pastel dream, soft pinks and mints', category: '配色氛围' },
  { id: 'cp4', label: '赛博霓虹', value: 'Cyberpunk neon, glowing accents on dark theme', category: '配色氛围' },
  { id: 'cp5', label: '低调深沉', value: 'Muted sophistication, deep charcoal and navy', category: '配色氛围' },
  
  // 技术细节 (Technical Details)
  { id: 'td1', label: '抗锯齿', value: 'Anti-aliasing, crystal sharp edges', category: '技术细节' },
  { id: 'td2', label: '高斯模糊', value: 'Gaussian blur overlays, soft focus transitions', category: '技术细节' },
  { id: 'td3', label: '次表面散射', value: 'Subsurface scattering for realistic 3D textures', category: '技术细节' },
  { id: 'td4', label: '微观排版', value: 'Micro-typography, precise kerning and line-height', category: '技术细节' },
  { id: 'td5', label: '动态阴影', value: 'Dynamic shadow mapping, real-time lighting simulation', category: '技术细节' }
];
