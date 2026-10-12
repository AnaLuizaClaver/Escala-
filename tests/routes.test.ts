import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPublicPath, pathForView, viewForPath, viewPaths } from '../src/app/router/routes.ts';

test('cada tela principal tem URL própria e reversível', () => {
  for (const [view, path] of Object.entries(viewPaths)) {
    const url = path.includes(':id') ? pathForView(view, { id: 'exemplo' }) : pathForView(view);
    assert.equal(viewForPath(url), view);
  }
});
test('URLs públicas e detalhes diretos são reconhecidos', () => {
  assert.equal(isPublicPath('/cadastro'), true);
  assert.equal(isPublicPath('/admin'), false);
  assert.equal(viewForPath('/admin/ministerios/louvor'), 'admin_ministerio_detalhes');
  assert.equal(viewForPath('/escalas/culto'), 'detalhes');
});
