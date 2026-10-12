import type React from 'react';
import { previewUser } from '../mocks/previewData';
import { usePreviewAccess } from '../features/auth/store';

// Alterna apenas a interface de demonstração; não autentica usuários.
export function PreviewProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function usePreview() {
  const { showApp, enterApp, showLogin } = usePreviewAccess();
  return { user: previewUser, showApp, enterApp, showLogin };
}
