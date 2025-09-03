import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Canvas/viewport state
export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

// UI state interface
export interface UIState {
  // Canvas and viewport
  transform: Transform;
  isDragging: boolean;
  dragStart: { x: number; y: number };
  
  // Mobile and responsive
  isMobile: boolean;
  
  // UI controls
  controlsExpanded: boolean;
  isPlacing: boolean;
  placementPos: { x: number; y: number };
  
  // Notifications and feedback
  showNotification: boolean;
  notificationMessage: string;
  notificationType: 'success' | 'error' | 'info';
  
  // Scoring visualization state
  highlightedTiles: Array<{ x: number; y: number }> | null;
  highlightedCondition: string | null; // ID of the condition being hovered
  highlightedClusterType: 'residential' | 'commercial' | 'industrial' | 'park' | null;
  showRoadNetworks: boolean;
  
  // Actions
  setTransform: (transform: Partial<Transform>) => void;
  setDragging: (isDragging: boolean, dragStart?: { x: number; y: number }) => void;
  setMobile: (isMobile: boolean) => void;
  setControlsExpanded: (expanded: boolean) => void;
  setPlacing: (isPlacing: boolean, pos?: { x: number; y: number }) => void;
  showNotificationMessage: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
  resetUI: () => void;
  setHighlightedTiles: (tiles: Array<{ x: number; y: number }> | null) => void;
  setHighlightedCondition: (conditionId: string | null) => void;
  setHighlightedClusterType: (type: 'residential' | 'commercial' | 'industrial' | 'park' | null) => void;
  setShowRoadNetworks: (show: boolean) => void;
}

// Default state
const defaultState = {
  transform: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  },
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  isMobile: false,
  controlsExpanded: false,
  isPlacing: false,
  placementPos: { x: 0, y: 0 },
  showNotification: false,
  notificationMessage: '',
  notificationType: 'info' as const,
  highlightedTiles: null,
  highlightedCondition: null,
  highlightedClusterType: null,
  showRoadNetworks: false,
};

export const useUIStore = create<UIState>()(
  subscribeWithSelector((set, get) => ({
    ...defaultState,
    
    // Transform actions
    setTransform: (newTransform: Partial<Transform>) =>
      set((state) => ({
        transform: { ...state.transform, ...newTransform },
      })),
    
    // Drag actions
    setDragging: (isDragging: boolean, dragStart?: { x: number; y: number }) =>
      set(() => ({
        isDragging,
        dragStart: dragStart || get().dragStart,
      })),
    
    // Mobile detection
    setMobile: (isMobile: boolean) =>
      set(() => ({ isMobile })),
    
    // Controls
    setControlsExpanded: (expanded: boolean) =>
      set(() => ({ controlsExpanded: expanded })),
    
    // Placement state
    setPlacing: (isPlacing: boolean, pos?: { x: number; y: number }) =>
      set((state) => ({
        isPlacing,
        placementPos: pos || state.placementPos,
      })),
    
    // Notifications
    showNotificationMessage: (message: string, type: 'success' | 'error' | 'info' = 'info') =>
      set(() => ({
        showNotification: true,
        notificationMessage: message,
        notificationType: type,
      })),
    
    hideNotification: () =>
      set(() => ({
        showNotification: false,
        notificationMessage: '',
      })),
    
    // Reset UI to default state
    resetUI: () =>
      set(() => defaultState),
    
    // Scoring visualization actions
    setHighlightedTiles: (tiles: Array<{ x: number; y: number }> | null) =>
      set(() => ({ highlightedTiles: tiles })),
    
    setHighlightedCondition: (conditionId: string | null) =>
      set(() => ({ highlightedCondition: conditionId })),
    
    setHighlightedClusterType: (type: 'residential' | 'commercial' | 'industrial' | 'park' | null) =>
      set(() => ({ highlightedClusterType: type })),
    
    setShowRoadNetworks: (show: boolean) =>
      set(() => ({ showRoadNetworks: show })),
  }))
);

// Individual property selectors to avoid object creation on every render
export const useTransform = () => useUIStore((state) => state.transform);
export const useIsDragging = () => useUIStore((state) => state.isDragging);
export const useDragStart = () => useUIStore((state) => state.dragStart);
export const useIsPlacing = () => useUIStore((state) => state.isPlacing);
export const usePlacementPos = () => useUIStore((state) => state.placementPos);
export const useShowNotification = () => useUIStore((state) => state.showNotification);
export const useNotificationMessage = () => useUIStore((state) => state.notificationMessage);
export const useNotificationType = () => useUIStore((state) => state.notificationType);