import { exportLocalData, localDataProblem } from '../../mocks/previewData';
import { usePreviewDataRevision } from '../state/dataRevision';

export function LocalDataNotice() {
  usePreviewDataRevision(state => state.revision);
  function download() {
    const url = URL.createObjectURL(new Blob([exportLocalData()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `escalae-local-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="relative z-50 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-4 py-2 text-xs" aria-label="Armazenamento dos dados">
    <span>Versão local · Dados somente neste navegador · Perfil inicial de exemplo</span>
    <button type="button" onClick={download} className="rounded-lg border border-border px-3 py-2 font-bold">Baixar cópia dos dados</button>
    {localDataProblem() && <p role="alert" className="w-full text-destructive">{localDataProblem()}</p>}
  </section>;
}
