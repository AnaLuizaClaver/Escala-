import { create } from 'zustand';

interface PreviewDataState {
  revision: number;
  changed: () => void;
}
export const usePreviewDataRevision = create<PreviewDataState>(set => ({
  revision: 0,
  changed: () => set(state => ({ revision: state.revision + 1 })),
}));
