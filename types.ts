
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  LIBRARY = 'LIBRARY',
  BUILDER = 'BUILDER',
  ANALYZER = 'ANALYZER',
  METHODOLOGIES = 'METHODOLOGIES'
}

export interface PromptItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: number;
}

export type CategoryType = '公式' | '视觉风格' | '布局结构' | '配色氛围' | '技术细节';

export interface StickyNote {
  id: string;
  label: string;
  value: string;
  category: CategoryType;
  imageUrls?: string[];
}

export interface Methodology {
  id: string;
  name: string;
  imageUrl: string;
  analysis: {
    visualStyle: string;
    colorPalette: string[];
    typography: string;
    layoutLogic: string;
    methodologySteps: string[];
  };
  createdAt: number;
}
