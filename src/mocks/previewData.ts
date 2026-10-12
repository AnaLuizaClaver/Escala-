// Dados de demonstração. Alterações vivem somente na memória desta página.
export type PreviewRow = Record<string, any>;
const now = new Date();
const future = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
export const previewUser = { id: 'ana', email: 'ana@example.com', user_metadata: { full_name: 'Ana Silva' } };
const created_at = now.toISOString();
const items: Record<string, PreviewRow[]> = {
  profiles: [
    { id: 'ana', full_name: 'Ana Silva', email: previewUser.email, phone: '(11) 99999-0000', role: 'admin', birth_date: '1995-10-20', avatar_url: '', availability: { Dom: ['Manhã', 'Noite'], Seg: [], Ter: ['Noite'], Qua: ['Noite'], Qui: [], Sex: [], Sáb: ['Tarde'] }, created_at },
    { id: 'pedro', full_name: 'Pedro Santos', birth_date: '1992-10-15', avatar_url: '', role: 'volunteer', created_at },
  ],
  ministries: [
    { id: 'louvor', name: 'Louvor', description: 'Servindo através da música', icon: '🎵', color: '#C6FF4D', auto_schedule_enabled: false, created_at },
    { id: 'midia', name: 'Mídia', description: 'Comunicação e transmissão', icon: '📷', color: '#60a5fa', auto_schedule_enabled: false, created_at },
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
  if (collection === 'ministries') { many('ministry_members', 'ministry_id'); many('ministry_roles', 'ministry_id'); }
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
export function previewData(collection: string, action = 'read', payload?: any, matches: (row: PreviewRow) => boolean = () => true, options: { single?: boolean; limit?: number; order?: any } = {}): { data: any; error: any; count: number } {
  const list = items[collection] ||= [];
  let selected = list.filter(row => matches(expand(collection, row)));
  if (action === 'insert') {
    selected = (Array.isArray(payload) ? payload : [payload]).map(row => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }));
    list.push(...selected);
  } else if (action === 'update') selected.forEach(row => Object.assign(row, payload));
  else if (action === 'delete') items[collection] = list.filter(row => !selected.includes(row));
  let data = selected.map(row => expand(collection, row));
  if (options.order) {
    const [key, config] = options.order;
    data.sort((a, b) => String(getField(a, key) ?? '').localeCompare(String(getField(b, key) ?? '')) * (config.ascending === false ? -1 : 1));
  }
  const count = data.length;
  if (options.limit !== undefined) data = data.slice(0, options.limit);
  return { data: options.single ? data[0] || null : data, error: null, count };
}
