import { create } from 'zustand';

interface PreviewAccessState {
  showApp: boolean;
  enterApp: () => void;
  showLogin: () => void;
}
export const usePreviewAccess = create<PreviewAccessState>(set => ({
  showApp: true,
  enterApp: () => set({ showApp: true }),
  showLogin: () => set({ showApp: false }),
}));
