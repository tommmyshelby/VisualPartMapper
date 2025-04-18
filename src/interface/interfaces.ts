// interface/interfaces.ts

export type MarkerStatus = "unmapped" | "mapped" | "ok" | "notOK" | "editing";
export type ViewMode = "initial" | "mapping" | "complete";

export interface Part {
  partNumber: number;
  partName:string;
  group:number
  view: string;
  status?: MarkerStatus;
  coordinates?: { x: number; y: number };
}

export interface ImageState {
  file: File | null;
  objectUrl: string | null;
}

export interface State {
  views: string[];
  partsByView: Record<string, Part[]>;
  selectedView: string;
  images: Record<string, ImageState>;
  viewModes: Record<string, ViewMode>;
  currentPartIndices: Record<string, number>;
  
  // Actions
  setSelectedView: (view: string) => void;
  initializePartsData: (parts: Part[]) => void;
  setImage: (view: string, file: File | null) => void;
  cleanupImageUrls: () => void;
  updatePartMapping: (view: string, partNumber: number, x: number, y: number) => void;
  updatePartStatus: (view: string, partNumber: number, status: MarkerStatus) => void;
  removePartMapping: (view: string, partNumber: number) => void;
  setViewMode: (view: string, mode: ViewMode) => void;
  setCurrentPartIndex: (view: string, index: number) => void;
  resetViewMapping: (view: string) => void;
  enterEditMode: (view: string) => void
  
  
  // Selectors
  getCurrentViewImage: () => string | null;
  getCurrentViewFile: () => File | null;
  getCurrentViewParts: () => Part[];
  getCurrentViewMode: () => ViewMode;
  getCurrentPartIndex: () => number;
  getNextUnmappedPart: () => Part | undefined;


  exportData: () => ExportData | null;
}
export interface MapperProps {
  partsData?: Part[];
}
export interface ExportData {
  metadata: {
    exportedAt: string;
    viewCount: number;
  };
  views: {
    viewName: string;
    imageFileName: string | null;
    parts: {
      partNumber: number;
      partName:string;
      coordinates?: { x: number; y: number };
      status?: MarkerStatus;
    }[];
  }[];
}