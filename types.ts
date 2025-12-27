
export interface Step {
  id: number;
  title: string;
  shortDesc: string;
  detailedContent: string[];
  checklist: string[];
  tips: string[];
  icon: string;
  color: string;
  videoPrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
