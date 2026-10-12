type Row = Record<string, any> & { id: string };
export const previewIdentity = { uid: 'ana', displayName: 'Ana Silva', email: 'ana@example.com' };
const stamp = (date: Date) => ({ toDate: () => date, toMillis: () => date.getTime() });
const start = new Date(Date.now() + 7 * 86400000), end = new Date(start.getTime() + 7200000);
const lists: Record<string, Row[]> = {
  acessos: [{ id: 'ana', papel: 'administrador', ativo: true }],
  membros: [{ id: 'ana', nome: 'Ana Silva', ativo: true }, { id: 'pedro', nome: 'Pedro Santos', ativo: true }],
  ministerios: [{ id: 'louvor', nome: 'Louvor', descricao: 'Servindo através da música', cor: '#487666', ativo: true }],
  eventos: [{ id: 'culto', titulo: 'Culto de Celebração', local: 'Templo Principal', inicioEm: stamp(start), fimEm: stamp(end), status: 'publicado' }],
  escalas: [{ id: 'culto_louvor', eventoId: 'culto', ministerioId: 'louvor', inicioEm: stamp(start), fimEm: stamp(end), status: 'publicada' }],
  'ministerios/louvor/integrantes': [{ id: 'ana', papel: 'lider', ativo: true }, { id: 'pedro', papel: 'voluntario', ativo: true }],
  'ministerios/louvor/funcoes': [{ id: 'vocal', nome: 'Vocal', capacidade: 2, ordem: 0, ativo: true }],
  'escalas/culto_louvor/designacoes': [{ id: 'ana', membroId: 'ana', funcaoId: 'vocal', status: 'pendente' }],
  indisponibilidades: [], solicitacoesTroca: [],
};
let contact = { email: previewIdentity.email, telefone: '' };
export const previewRows = (key: string): Row[] => lists[key] ||= [];
export function previewRecord(path: string) { const parts = path.split('/'); const id = parts.pop(); return previewRows(parts.join('/')).find(row => row.id === id) || null; }
export function previewUpdate(path: string, data: Record<string, any>) { const row = previewRecord(path); if (row) Object.assign(row, data); }
function add(key: string, data: Record<string, any>, id: string = crypto.randomUUID()) { previewRows(key).push({ id, ...data }); return id; }
export const previewActions = {
  getAccess: (_uid: string) => ({ papel: 'administrador', ativo: true }),
  getProfile: (uid: string) => previewRecord(`membros/${uid}`),
  createProfile: (uid: string, nome: string) => add('membros', { nome, ativo: true }, uid),
  renameProfile: (uid: string, nome: string) => previewUpdate(`membros/${uid}`, { nome }),
  getPrivateContact: (_uid: string) => contact,
  savePrivateContact: (_uid: string, data: typeof contact) => { contact = data; },
  listMinistries: () => previewRows('ministerios').filter(row => row.ativo),
  createMinistry: (data: Record<string, any>) => add('ministerios', { ...data, ativo: true }),
  archiveMinistry: (id: string) => previewUpdate(`ministerios/${id}`, { ativo: false }),
  listFunctions: (id: string) => previewRows(`ministerios/${id}/funcoes`).filter(row => row.ativo),
  createFunction: (id: string, data: Record<string, any>) => add(`ministerios/${id}/funcoes`, { ...data, ativo: true }),
  createEvent: (data: Record<string, any>) => add('eventos', { ...data, inicioEm: stamp(data.inicioEm), fimEm: stamp(data.fimEm), status: 'rascunho' }),
  createDraftSchedule: (eventoId: string, ministerioId: string) => { const event = previewRecord(`eventos/${eventoId}`); if (!event) throw Error('Evento não encontrado.'); return add('escalas', { eventoId, ministerioId, inicioEm: event.inicioEm, fimEm: event.fimEm, status: 'rascunho' }, `${eventoId}_${ministerioId}`); },
  listPublishedSchedules: (id: string) => previewRows('escalas').filter(row => row.ministerioId === id && row.status === 'publicada'),
  listUnavailability: (uid: string) => previewRows('indisponibilidades').filter(row => row.membroId === uid),
};
export function previewCommand(action: string, data: Record<string, any> = {}) {
  const scheduleId = `${data.eventoId}_${data.ministerioId}`;
  switch (action) {
    case 'grantAccess': add('acessos', { papel: data.papel, ativo: true }, data.uid); break;
    case 'revokeAccess': previewUpdate(`acessos/${data.uid}`, { ativo: false }); break;
    case 'setMembership': {
      const path = `ministerios/${data.ministerioId}/integrantes`;
      if (previewRecord(`${path}/${data.uid}`)) previewUpdate(`${path}/${data.uid}`, data);
      else add(path, { papel: data.papel, ativo: data.ativo }, data.uid);
      break;
    }
    case 'addUnavailability': add('indisponibilidades', { membroId: 'ana', inicioEm: stamp(new Date(data.inicioEm)), fimEm: stamp(new Date(data.fimEm)) }); break;
    case 'cancelUnavailability': lists.indisponibilidades = previewRows('indisponibilidades').filter(row => row.id !== data.id); break;
    case 'publishSchedule':
      previewUpdate(`escalas/${scheduleId}`, { status: 'publicada' });
      lists[`escalas/${scheduleId}/designacoes`] = data.designacoes.map((row: any) => ({ ...row, id: row.membroId, status: 'pendente' })); break;
    case 'cancelSchedule': previewUpdate(`escalas/${scheduleId}`, { status: 'cancelada' }); break;
    case 'respondToAssignment': previewUpdate(`escalas/${scheduleId}/designacoes/ana`, { status: data.status }); break;
    case 'requestSwap': add('solicitacoesTroca', { ...data, solicitanteMembroId: 'ana', status: 'pendente' }); break;
    case 'approveSwap': previewUpdate(`solicitacoesTroca/${data.id}`, { status: 'aprovada' }); break;
    case 'rejectOrCancelSwap': previewUpdate(`solicitacoesTroca/${data.id}`, { status: data.status }); break;
    case 'replaceAssignment': {
      lists[`escalas/${scheduleId}/designacoes`] = previewRows(`escalas/${scheduleId}/designacoes`).map(row => row.id === data.originalUid ? { ...row, id: data.substitutoUid, membroId: data.substitutoUid, status: 'pendente' } : row); break;
    }
    default: throw Error('Ação de demonstração indisponível.');
  }
}
