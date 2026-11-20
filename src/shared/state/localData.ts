export type LocalTables = Record<string, Record<string, unknown>[]>;
export const LOCAL_DATA_KEY = 'escalae.react.local.v1';
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;

export function createLocalData(storage: StoragePort | undefined, seed: LocalTables) {
  let problem = '';
  let blocked = false;
  let original: string | null | undefined;
  let tables = structuredClone(seed);
  try {
    const raw = storage?.getItem(LOCAL_DATA_KEY);
    original = raw;
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved?.version !== 1 || !saved.tables || typeof saved.tables !== 'object' || Array.isArray(saved.tables)) throw new Error();
      for (const key of Object.keys(seed)) {
        const rows = saved.tables[key];
        if (!Array.isArray(rows) || rows.some((row: Record<string, unknown>) => !row || typeof row !== 'object' || Array.isArray(row) || typeof row.id !== 'string') || new Set(rows.map((row: Record<string, unknown>) => row.id)).size !== rows.length) throw new Error();
      }
      tables = Object.fromEntries(Object.keys(seed).map(key => [key, saved.tables[key]]));
    }
    if (!storage) problem = 'O armazenamento deste navegador está indisponível. As alterações não serão salvas.';
  } catch {
    blocked = true;
    problem = 'Não foi possível ler os dados salvos. Os dados anteriores foram preservados; alterações estão bloqueadas para evitar perda.';
  }
  return {
    tables,
    get problem() { return problem; },
    commit(next: LocalTables): Error | null {
      if (blocked || !storage) return new Error(problem);
      try {
        storage.setItem(LOCAL_DATA_KEY, JSON.stringify({ version: 1, tables: next }));
        problem = '';
        return null;
      } catch {
        problem = 'Não foi possível salvar. A alteração foi desfeita. Baixe uma cópia dos dados e verifique o espaço ou as permissões do navegador.';
        return new Error(problem);
      }
    },
    backup() { return blocked && original ? original : JSON.stringify({ version: 1, tables }, null, 2); },
  };
}
