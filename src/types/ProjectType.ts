export type ProjectType = 
  | "nodejs" 
  | "express" 
  | "nextjs" 
  | "react" 
  | "nest" 
  | "electron" 
  | "react-native";

export type Language = "js" | "ts";

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  language: Language;
}
