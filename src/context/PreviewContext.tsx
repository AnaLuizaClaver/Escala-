import React, { createContext, useContext, useState } from 'react';
import { previewUser } from '../mocks/previewData';
type PreviewNavigation = {
  user: typeof previewUser;
  showApp: boolean;
  enterApp: () => void;
  showLogin: () => void;
};
// Alterna telas de demonstração, sem autenticação ou persistência.
const PreviewContext = createContext<PreviewNavigation | undefined>(undefined);
export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [showApp, setShowApp] = useState(true);
  return <PreviewContext.Provider value={{ user: previewUser, showApp, enterApp: () => setShowApp(true), showLogin: () => setShowApp(false) }}>{children}</PreviewContext.Provider>;
}
export function usePreview() {
  const preview = useContext(PreviewContext);
  if (!preview) throw new Error('PreviewProvider ausente');
  return preview;
}
