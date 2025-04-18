
// store.ts
import { create } from "zustand";
import { State, Part, ViewMode, MarkerStatus, ImageState, ExportData } from "../interface/interfaces";

const useMapperStore = create<State>((set, get) => ({
  // Initial state
  views: [],
  partsByView: {},
  selectedView: "",
  images: {},
  viewModes: {},
  currentPartIndices: {},

  // Actions
  setSelectedView: (view) => set({ selectedView: view }),

  initializePartsData: (parts) => {
    // Group parts by view
    const partsByView: Record<string, Part[]> = {};
    const views: string[] = [];

    parts.forEach((part) => {
      if (!partsByView[part.view]) {
        partsByView[part.view] = [];
        views.push(part.view);
      }
      // Ensure all parts have a status field (default to unmapped)
      const enrichedPart = {
        ...part,
        status: part.status || ("unmapped" as MarkerStatus),
      };
      partsByView[part.view].push(enrichedPart);
    });

    // Initialize related states
    const images: Record<string, ImageState> = {};
    const viewModes: Record<string, ViewMode> = {};
    const currentPartIndices: Record<string, number> = {};

    views.forEach((view) => {
      images[view] = { file: null, objectUrl: null };
      viewModes[view] = "initial";
      currentPartIndices[view] = 0;
    });

    set({
      views,
      partsByView,
      images,
      viewModes,
      currentPartIndices,
      selectedView: views[0] || "",
    });
  },

  // Updated setImage method to handle File objects
  setImage: (view, file) => {
    // First, clean up any existing object URL to prevent memory leaks
    const state = get();
    if (state.images[view]?.objectUrl) {
      URL.revokeObjectURL(state.images[view].objectUrl);
    }

    // Create new object URL for the file
    const objectUrl = file ? URL.createObjectURL(file) : null;

    set((state) => ({
      images: { 
        ...state.images, 
        [view]: { 
          file,
          objectUrl 
        } 
      },
      viewModes: { ...state.viewModes, [view]: "initial" },
    }));
  },

  // Method to clean up object URLs when no longer needed
  cleanupImageUrls: () => {
    const { images } = get();
    
    Object.values(images).forEach(imageState => {
      if (imageState.objectUrl) {
        URL.revokeObjectURL(imageState.objectUrl);
      }
    });
  },


 
exportData: (): ExportData | null => {
  const state = get();
  
  // Check if all views are complete
  const allComplete = Object.values(state.viewModes).every(
    mode => mode === "complete"
  );
  
  if (!allComplete) {
    alert("Cannot export - not all views are complete!");
    return null;
  }
  
  // Prepare export data
  const exportData: ExportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      viewCount: state.views.length,
    },
    views: state.views.map(view => ({
      viewName: view,
      imageFileName: state.images[view].file?.name || null, // Store original filename
      parts: state.partsByView[view].map(part => ({
        partNumber: part.partNumber,
        partName:part.partName,
        coordinates: part.coordinates,
        status: part.status,
      })),
    })),
  };
  
  return exportData;
},
  updatePartMapping: (view, partNumber, x, y) =>
    set((state) => {
      const updatedParts = state.partsByView[view].map((part) =>
        part.partNumber === partNumber
          ? {
              ...part,
              status: "mapped" as MarkerStatus,
              coordinates: { x, y },
            }
          : part
      );

      // Check if all parts are mapped
      const allMapped = updatedParts.every((p) => p.status === "mapped");
      const newMode = allMapped ? "complete" : state.viewModes[view];

      return {
        partsByView: {
          ...state.partsByView,
          [view]: updatedParts,
        },
        viewModes: {
          ...state.viewModes,
          [view]: newMode,
        },
      } as Partial<State>;
    }),

  updatePartStatus: (view, partNumber, status) =>
    set((state) => ({
      partsByView: {
        ...state.partsByView,
        [view]: state.partsByView[view].map((part) =>
          part.partNumber === partNumber ? { ...part, status } : part
        ),
      },
    })),

  removePartMapping: (view, partNumber) =>
    set((state) => ({
      partsByView: {
        ...state.partsByView,
        [view]: state.partsByView[view].map((part) =>
          part.partNumber === partNumber
            ? {
                ...part,
                status: "unmapped",
                coordinates: undefined,
              }
            : part
        ),
      },
    })),

  setViewMode: (view, mode) =>
    set((state) => ({ viewModes: { ...state.viewModes, [view]: mode } })),

  setCurrentPartIndex: (view, index) =>
    set((state) => ({
      currentPartIndices: { ...state.currentPartIndices, [view]: index },
    })),

  resetViewMapping: (view) =>
    set((state) => ({
      partsByView: {
        ...state.partsByView,
        [view]: state.partsByView[view].map((part) => ({
          ...part,
          status: "unmapped",
          coordinates: undefined,
        })),
      },
      viewModes: { ...state.viewModes, [view]: "initial" },
      currentPartIndices: { ...state.currentPartIndices, [view]: 0 },
    })),

  // Add this action to enter edit mode
  enterEditMode: (view) =>
    set((state) => ({
      viewModes: { ...state.viewModes, [view]: "mapping" },
    })),

  // Updated selectors
  getCurrentViewImage: () => {
    const { images, selectedView } = get();
    return images[selectedView]?.objectUrl || null;
  },
  
  getCurrentViewFile: () => {
    const { images, selectedView } = get();
    return images[selectedView]?.file || null;
  },

  getCurrentViewParts: () => {
    const { partsByView, selectedView } = get();
    return partsByView[selectedView] || [];
  },

  getCurrentViewMode: () => {
    const { viewModes, selectedView } = get();
    return viewModes[selectedView] || "initial";
  },

  getCurrentPartIndex: () => {
    const { currentPartIndices, selectedView } = get();
    return currentPartIndices[selectedView] || 0;
  },

  getNextUnmappedPart: () => {
    const { getCurrentViewParts } = get();
    const currentParts = getCurrentViewParts();

    return currentParts.find((part) => part.status === "unmapped");
  },
}));

// Clean up object URLs when store is garbage collected
window.addEventListener('beforeunload', () => {
  const store = useMapperStore.getState();
  store.cleanupImageUrls();
});

export default useMapperStore;