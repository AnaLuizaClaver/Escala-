import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLocalData, LOCAL_DATA_KEY } from '../src/shared/state/localData.ts';

test('alterações e exclusões sobrevivem a nova abertura, sem repor exemplos removidos', () => {
  const stored = new Map<string, string>();
  const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { stored.set(key, value); } };
  const seed = { ministries: [{ id: 'example', name: 'Exemplo' }], people: [] };
  const first = createLocalData(storage, seed);
  first.tables.ministries = [{ id: 'real', name: 'Recepção' }];
  assert.equal(first.commit(first.tables), null);
  assert.equal(createLocalData(storage, seed).tables.ministries[0].name, 'Recepção');
  first.tables.ministries = [];
  first.commit(first.tables);
  assert.deepEqual(createLocalData(storage, seed).tables.ministries, []);
  assert.equal(JSON.parse(first.backup()).version, 1);
});

test('dados inválidos permanecem intactos e bloqueiam sobrescrita', () => {
  for (const raw of ['{', JSON.stringify({ version: 99, tables: {} }), JSON.stringify({ version: 1, tables: { people: [{ id: 'a' }, { id: 'a' }] } })]) {
    let writes = 0;
    const local = createLocalData({ getItem: () => raw, setItem: () => { writes++; } }, { people: [] });
    assert.ok(local.problem);
    assert.ok(local.commit({ people: [] }) instanceof Error);
    assert.equal(writes, 0);
    assert.equal(local.backup(), raw);
  }
});

test('interface React restaura cadastros e desfaz mutação quando a gravação falha', async () => {
  const stored = new Map<string, string>();
  let full = false;
  const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => { if (full) throw new Error('quota'); stored.set(key, value); } };
  Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });
  try {
    const path = '../src/mocks/previewData.ts';
    const first = await import(`${path}?first`);
    const inserted = first.previewData('ministries', 'insert', { name: 'Recepção' }, undefined, { single: true });
    assert.equal(inserted.error, null);
    const reopened = await import(`${path}?reopened`);
    assert.equal(reopened.previewData('ministries', 'read', undefined, (row: { id: string }) => row.id === inserted.data.id, { single: true }).data.name, 'Recepção');
    full = true;
    const failed = reopened.previewData('ministries', 'update', { name: 'Não salvar' }, (row: { id: string }) => row.id === inserted.data.id);
    assert.ok(failed.error);
    assert.equal(reopened.previewData('ministries', 'read', undefined, (row: { id: string }) => row.id === inserted.data.id, { single: true }).data.name, 'Recepção');
    assert.ok(reopened.localDataProblem());
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
  }
});

test('falta de espaço ou armazenamento indisponível é informada', () => {
  const full = createLocalData({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, { people: [] });
  assert.ok(full.commit({ people: [] }) instanceof Error);
  assert.ok(full.problem.includes('desfeita'));
  assert.ok(createLocalData(undefined, { people: [] }).problem);
  assert.equal(LOCAL_DATA_KEY, 'escalae.react.local.v1');
});
