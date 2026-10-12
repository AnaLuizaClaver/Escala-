import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previewData, getField } from '../src/mocks/previewData.ts';
import { previewRows, previewCommand, previewActions } from '../src/mocks/rebuildPreview.ts';
test('dados iniciais permitem navegar com perfil, ministérios e escalas completos', () => {
  const membership = previewData('ministry_members', 'read', undefined, row => row.user_id === 'ana');
  assert.equal(membership.data.length, 2);
  assert.equal(membership.data[0].ministries.name, 'Louvor');
  const slots = previewData('schedule_members', 'read', undefined, row => getField(row, 'schedules.status') === 'published');
  assert.equal(slots.data.length, 2);
  assert.equal(slots.data[0].schedules.schedule_members[0].ministry_members.profiles.full_name, 'Ana Silva');
  assert.equal(previewData('schedule_songs').data[0].songs.title, 'Bondade de Deus');
});
test('edições, criação e exclusão ficam em memória e aparecem na próxima leitura', () => {
  const created = previewData('songs', 'insert', { title: 'Teste de repertório' }, undefined, { single: true }).data;
  previewData('songs', 'update', { title: 'Título alterado' }, row => row.id === created.id);
  assert.equal(previewData('songs', 'read', undefined, row => row.id === created.id, { single: true }).data.title, 'Título alterado');
  previewData('songs', 'delete', undefined, row => row.id === created.id);
  assert.equal(previewData('songs', 'read', undefined, row => row.id === created.id).count, 0);
});
test('confirmação da escala é refletida nos dados relacionados', () => {
  previewData('schedule_members', 'update', { response: 'confirmed' }, row => row.id === 'slot-ana');
  assert.equal(previewData('schedules').data[0].schedule_members[0].response, 'confirmed');
});
test('cadastro e diretório recebem ministérios ativos com vínculos completos', () => {
  const ministries = previewData('ministries', 'read', undefined, row => getField(row, 'active') === true).data;
  assert.ok(ministries.some((ministry: { name: string }) => ministry.name === 'Louvor'));
  const ana = previewData('profiles', 'read', undefined, row => row.id === 'ana', { single: true }).data;
  assert.deepEqual(ana.ministry_members.map((member: { ministries: { name: string } }) => member.ministries.name).sort(), ['Louvor', 'Mídia']);
  const louvor = ministries.find((ministry: { name: string }) => ministry.name === 'Louvor');
  assert.equal(louvor.schedules.length, 1);
});
test('mutações inexistentes falham e exclusões removem vínculos dependentes', () => {
  const missing = previewData('songs', 'update', { title: 'Nada' }, row => row.id === 'inexistente');
  assert.ok(missing.error);
  const ministry = previewData('ministries', 'insert', { name: 'Teste', active: true }, undefined, { single: true }).data;
  const member = previewData('ministry_members', 'insert', { user_id: 'ana', ministry_id: ministry.id, role: 'volunteer', status: 'approved' }, undefined, { single: true }).data;
  previewData('ministries', 'delete', undefined, row => row.id === ministry.id);
  assert.equal(previewData('ministry_members', 'read', undefined, row => row.id === member.id).count, 0);
});
test('interface alternativa permite criar e publicar escala sem servidor', () => {
  const id = previewActions.createEvent({ titulo: 'Ensaio', local: 'Igreja', inicioEm: new Date(), fimEm: new Date(Date.now() + 3600000) });
  const scheduleId = previewActions.createDraftSchedule(id, 'louvor');
  previewCommand('publishSchedule', { eventoId: id, ministerioId: 'louvor', designacoes: [{ membroId: 'ana', funcaoId: 'vocal' }] });
  assert.equal(previewRows('escalas').find(row => row.id === scheduleId)?.status, 'publicada');
  assert.equal(previewRows(`escalas/${scheduleId}/designacoes`)[0].membroId, 'ana');
});
