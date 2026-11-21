import type { SupabaseClient } from '@supabase/supabase-js';
// Exemplos iniciais. Dados da interface React persistem neste navegador.
import { createLocalData } from '../shared/state/localData.ts';
import { usePreviewDataRevision } from '../shared/state/dataRevision.ts';
export type PreviewRow = Record<string, any>;
const now = new Date();
const future = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
export const previewUser = { id: 'ana', email: 'ana@example.com', user_metadata: { full_name: 'Ana Silva' } };
const created_at = now.toISOString();
const seed: Record<string, PreviewRow[]> = {
  profiles: [
    { id: 'ana', full_name: 'Ana Silva', email: previewUser.email, phone: '(11) 99999-0000', role: 'admin', birth_date: '1995-10-20', avatar_url: '', availability: { Dom: ['Manhã', 'Noite'], Seg: [], Ter: ['Noite'], Qua: ['Noite'], Qui: [], Sex: [], Sáb: ['Tarde'] }, created_at },
    { id: 'pedro', full_name: 'Pedro Santos', birth_date: '1992-10-15', avatar_url: '', role: 'volunteer', created_at },
  ],
  ministries: [
    { id: 'louvor', name: 'Louvor', description: 'Servindo através da música', icon: '🎵', color: '#C6FF4D', active: true, auto_schedule_enabled: false, created_at },
    { id: 'midia', name: 'Mídia', description: 'Comunicação e transmissão', icon: '📷', color: '#60a5fa', active: true, auto_schedule_enabled: false, created_at },
  ],
  ministry_roles: [{ id: 'vocal', ministry_id: 'louvor', name: 'Vocal', max_volunteers: 2 }, { id: 'camera', ministry_id: 'midia', name: 'Câmera', max_volunteers: 1 }],
  ministry_members: [{ id: 'ana-louvor', user_id: 'ana', ministry_id: 'louvor', role: 'leader', status: 'approved', created_at }, { id: 'pedro-louvor', user_id: 'pedro', ministry_id: 'louvor', role: 'volunteer', status: 'approved', created_at }, { id: 'ana-midia', user_id: 'ana', ministry_id: 'midia', role: 'leader', status: 'approved', created_at }],
  schedules: [{ id: 'culto', ministry_id: 'louvor', title: 'Culto de Celebração', description: 'Um encontro para servir juntos', date: future, start_time: '19:00', end_time: '21:00', location: 'Templo Principal', status: 'published', created_at }],
  schedule_members: [{ id: 'slot-ana', schedule_id: 'culto', role_id: 'vocal', ministry_member_id: 'ana-louvor', response: 'pending', created_at }, { id: 'slot-aberto', schedule_id: 'culto', role_id: 'vocal', ministry_member_id: null, response: 'pending', created_at }],
  songs: [{ id: 'song-1', title: 'Bondade de Deus', artist: 'Isaías Saad', bpm: 68, musical_key: 'G', notes: 'Versão acústica', cifra_url: '', youtube_url: '', created_at }],
  schedule_songs: [{ id: 'repertorio-1', schedule_id: 'culto', song_id: 'song-1', position: 1 }],
  schedule_swap_requests: [],
  feed_posts: [{ id: 'aviso', author_id: 'ana', ministry_id: 'louvor', type: '📢 Aviso', title: 'Ensaio da semana', content: 'Vamos preparar juntos o próximo encontro!', created_at }],
  feed_comments: [], feed_likes: [],
  volunteer_of_month: [{ id: 'destaque', volunteer_id: 'pedro', ministry_id: 'louvor', month: now.getMonth() + 1, year: now.getFullYear(), reason: 'Dedicação e alegria ao servir', created_at }],
};
let browserStorage: Storage | undefined;
try { if (typeof window !== 'undefined') browserStorage = window.localStorage; } catch { /* Mostra aviso sem sobrescrever dados. */ }
const localData = createLocalData(browserStorage, seed);
const localItems = localData.tables as Record<string, PreviewRow[]>;
type DataSource = { client: SupabaseClient; tables: Record<string, PreviewRow[]> };
let onlineSource: DataSource | undefined;
let items = localItems;

export async function loadOnlineTables(client: SupabaseClient, signal: AbortSignal) {
  const tables = await Promise.all(Object.keys(seed).map(async collection => {
    const rows: PreviewRow[] = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const page = await client.from(collection).select('*').order('id')
        .range(offset, offset + pageSize - 1).abortSignal(signal);
      if (page.error) throw page.error;
      rows.push(...page.data);
      if (page.data.length < pageSize) return [collection, rows] as const;
    }
  }));
  const leaders = await client.rpc('ministry_leader_names').abortSignal(signal);
  if (leaders.error) throw leaders.error;
  return { ...Object.fromEntries(tables), ministry_leaders: leaders.data };
}

export function attachOnlineTables(client: SupabaseClient, tables: DataSource['tables']) {
  const source = { client, tables };
  onlineSource = source;
  items = tables;
  return () => {
    if (onlineSource !== source) return;
    onlineSource = undefined;
    items = localItems;
  };
}

export function hasOnlineTables() {
  return onlineSource !== undefined;
}
export const localDataProblem = () => localData.problem;
export const exportLocalData = () => localData.backup();
function expand(collection: string, row: PreviewRow, depth = 0): PreviewRow {
  if (depth > 3) return { ...row };
  const result = { ...row };
  const one = (key: string, name: string, id: any) => { result[key] = items[name]?.find(r => r.id === id); if (result[key]) result[key] = expand(name, result[key], depth + 1); };
  const many = (name: string, key: string) => { result[name] = (items[name] || []).filter(r => r[key] === row.id).map(r => expand(name, r, depth + 1)); };
  one('ministries', 'ministries', row.ministry_id);
  one('profiles', 'profiles', row.user_id || row.author_id || row.volunteer_id);
  one('ministry_roles', 'ministry_roles', row.role_id);
  one('ministry_members', 'ministry_members', row.ministry_member_id);
  one('schedules', 'schedules', row.schedule_id);
  one('songs', 'songs', row.song_id);
  if (collection === 'schedules') { many('schedule_members', 'schedule_id'); many('schedule_songs', 'schedule_id'); }
  if (collection === 'feed_posts') { many('feed_comments', 'post_id'); many('feed_likes', 'post_id'); }
  if (collection === 'ministries') { many('ministry_members', 'ministry_id'); many('ministry_roles', 'ministry_id'); many('schedules', 'ministry_id'); }
  if (collection === 'profiles') many('ministry_members', 'user_id');
  if (collection === 'schedule_swap_requests') {
    one('schedule_members', 'schedule_members', row.schedule_member_id);
    one('requester', 'ministry_members', row.requester_id);
    one('target', 'ministry_members', row.target_member_id);
  }
  return result;
}
export function getField(row: PreviewRow, path: string): any {
  return path.replace(/\(/g, '.').replace(/\)/g, '').split('.').reduce((value, key) => value?.[key], row);
}
const childRelations: Record<string, Array<[string, string]>> = {
  ministries: [['ministry_roles', 'ministry_id'], ['ministry_members', 'ministry_id'], ['schedules', 'ministry_id'], ['feed_posts', 'ministry_id'], ['volunteer_of_month', 'ministry_id']],
  profiles: [['ministry_members', 'user_id'], ['feed_posts', 'author_id'], ['volunteer_of_month', 'volunteer_id']],
  ministry_members: [['schedule_members', 'ministry_member_id'], ['schedule_swap_requests', 'requester_id'], ['schedule_swap_requests', 'target_member_id']],
  schedules: [['schedule_members', 'schedule_id'], ['schedule_songs', 'schedule_id']],
  schedule_members: [['schedule_swap_requests', 'schedule_member_id']],
  songs: [['schedule_songs', 'song_id']],
  feed_posts: [['feed_comments', 'post_id'], ['feed_likes', 'post_id']],
};
function removeRelated(collection: string, id: string) {
  for (const [childCollection, foreignKey] of childRelations[collection] || []) {
    const children = items[childCollection]?.filter(row => row[foreignKey] === id) || [];
    for (const child of children) removeRelated(childCollection, child.id);
    items[childCollection] = (items[childCollection] || []).filter(row => row[foreignKey] !== id);
  }
}
export function previewData(collection: string, action = 'read', payload?: any, matches: (row: PreviewRow) => boolean = () => true, options: { single?: boolean; limit?: number; order?: any } = {}): { data: any; error: any; count: number } {
  if (action !== 'read' && onlineSource) {
    return { data: null, error: new Error('A ação precisa ser salva no servidor.'), count: 0 };
  }
  const before = action === 'read' ? null : structuredClone(items);
  const list = items[collection] ||= [];
  let selected = list.filter(row => matches(expand(collection, row)));
  if (action === 'insert') {
    selected = (Array.isArray(payload) ? payload : [payload]).map(row => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...(collection === 'ministries' ? { active: true } : {}), ...row }));
    list.push(...selected);
  } else if (action === 'update') selected.forEach(row => Object.assign(row, payload));
  else if (action === 'delete') {
    for (const row of selected) removeRelated(collection, row.id);
    items[collection] = list.filter(row => !selected.includes(row));
  }
  if ((action === 'update' || action === 'delete') && selected.length === 0) return { data: options.single ? null : [], error: new Error('Registro nÃ£o encontrado.'), count: 0 };
  if (before && typeof window !== 'undefined') {
    const error = localData.commit(items);
    if (error) {
      for (const key of Object.keys(items)) delete items[key];
      Object.assign(items, before);
      usePreviewDataRevision.getState().changed();
      return { data: options.single ? null : [], error, count: 0 };
    }
  }
  let data = selected.map(row => expand(collection, row));
  if (options.order) {
    const [key, config] = options.order;
    data.sort((a, b) => String(getField(a, key) ?? '').localeCompare(String(getField(b, key) ?? '')) * (config.ascending === false ? -1 : 1));
  }
  const count = data.length;
  if (options.limit !== undefined) data = data.slice(0, options.limit);
  if (action !== 'read' && count > 0) usePreviewDataRevision.getState().changed();
  return { data: options.single ? data[0] || null : data, error: null, count };
}


export async function saveData(
  collection: string,
  action: 'insert' | 'update' | 'delete',
  payload?: any,
  matches: (row: PreviewRow) => boolean = () => true,
  options: Parameters<typeof previewData>[4] = {},
): Promise<ReturnType<typeof previewData>> {
  const source = onlineSource;
  if (!source) return previewData(collection, action, payload, matches, options);
  const failed = (error: unknown) => ({ data: null, error, count: 0 });
  const table = source.client.from(collection);
  let query;
  if (collection === 'schedule_members' && payload && 'response_at' in payload) {
    const { response_at, ...fields } = payload;
    payload = fields;
  }

  if (action === 'insert') {
    query = table.insert(payload).select();
  } else {
    const selected = source.tables[collection].filter(row => matches(expand(collection, row)));
    // The current screens edit one record at a time.
    if (selected.length !== 1) return failed(new Error('Registro indisponível ou alterado.'));
    const [record] = selected;
    let change = (action === 'update' ? table.update(payload) : table.delete()).eq('id', record.id);
    if (record.status) change = change.eq('status', record.status);
    if (collection === 'schedule_members') {
      change = record.ministry_member_id === null
        ? change.is('ministry_member_id', null)
        : change.eq('ministry_member_id', record.ministry_member_id);
      change = change.eq('response', record.response);
    }
    query = change.select();
  }

  const { data, error } = await query;
  if (error) return failed(error);
  if (!data.length) return failed(new Error('Registro indisponível ou alterado.'));
  if (onlineSource === source) {
    const changedIds = new Set(data.map(row => row.id));
    const remaining = source.tables[collection].filter(row => !changedIds.has(row.id));
    source.tables[collection] = action === 'delete' ? remaining : remaining.concat(data);
    usePreviewDataRevision.getState().changed();
  }
  return { data: options.single ? data[0] : data, error: null, count: data.length };
}
