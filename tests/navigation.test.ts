import { registerHooks } from 'node:module';
import assert from 'node:assert/strict';
import { test } from 'node:test';
test('todas as seis páginas da interface alternativa renderizam sem autenticação', async () => {
  const handlers = new Map();
  const root = { innerHTML: '', addEventListener: (name, handler) => handlers.set(name, handler) };
  const previous = globalThis.document;
  globalThis.document = { querySelector: () => root };
  const hooks = registerHooks({ load(url, context, next) { return url.endsWith('.css') ? { format: 'module', source: '', shortCircuit: true } : next(url, context); } });
  try {
    await import('../rebuild/web/main.ts');
    await new Promise(resolve => setImmediate(resolve));
    for (const [section, heading] of [['overview', 'Organização para servir.'], ['ministries', 'Ministérios'], ['members', 'Pessoas'], ['events', 'Encontros e eventos'], ['schedules', 'Escalas'], ['availability', 'Minha disponibilidade']]) {
      handlers.get('click')({ target: { closest: () => ({ dataset: { action: 'navigate', section } }) } });
      assert.ok(root.innerHTML.includes(heading), section);
      assert.ok(!root.innerHTML.includes('role="alert"'), section);
    }
  } finally { hooks.deregister(); globalThis.document = previous; }
});
