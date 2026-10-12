import test from 'node:test'
import assert from 'node:assert/strict'
import { churchDate } from './time.ts'
test('church dates use São Paulo rather than device timezone, with calendar validation',()=>{
  assert.equal(churchDate('2026-10-11T09:30').toISOString(),'2026-10-11T12:30:00.000Z')
  assert.equal(churchDate('2026-12-31T23:30').toISOString(),'2027-01-01T02:30:00.000Z')
  assert.throws(()=>churchDate('2026-02-30T09:30'))
  assert.throws(()=>churchDate('not-a-date'))
})
