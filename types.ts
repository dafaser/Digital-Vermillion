
export type Language = 'en' | 'id';

export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  content: any; // Simplified for this example, could be strongly typed
}