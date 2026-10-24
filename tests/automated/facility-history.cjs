// Contract checks for the history route; database and session boundaries mocked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const id = '11111111-1111-4111-8111-111111111111';
let denied = null, exists = true, calls = [], count = 26;
const prisma = {
  facilities_Table: { findUnique: async args => { calls.push(args); return exists ? { id } : null; } },
  facility_audit_events: { findMany: async args => { calls.push(args); return Array.from({ length: count }, (_, i) => ({ id: String(i) })); } },
};
const moduleObject = { exports: {} };
const source = ts.transpileModule(fs.readFileSync('app/api/facilities/[id]/history/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInNewContext(source, { exports: moduleObject.exports, module: moduleObject, URL, console: { error() {} }, require(name) {
  if (name === 'next/server') return { NextResponse: { json: (data, options) => ({ data, ...options, status: options.status ?? 200 }) } };
  if (name === '@/lib/auth/access') return { requireFacilityAccess: async () => denied };
  if (name === '@/lib/prisma') return { prisma };
  throw new Error(name);
} });
const get = (query = '', facilityId = id) => moduleObject.exports.GET(new Request('https://example.test/api/facilities/' + facilityId + '/history' + query), { params: Promise.resolve({ id: facilityId }) });
(async () => {
  for (const status of [401, 403]) {
    denied = { status, error: 'Denied' }; calls = [];
    const result = await get(); assert.equal(result.status, status); assert.equal(calls.length, 0);
    assert.equal(result.headers['Cache-Control'], 'private, no-store');
  }
  denied = null;
  assert.equal((await get('', 'bad-id')).status, 400);
  for (const page of ['0', '-1', '1.5', '10001', 'NaN']) assert.equal((await get('?page=' + page)).status, 400);
  exists = false; assert.equal((await get()).status, 404); exists = true;
  calls = []; const result = await get('?page=2');
  assert.equal(result.status, 200); assert.equal(result.data.events.length, 25); assert.equal(result.data.hasMore, true);
  assert.equal(calls[1].skip, 25); assert.equal(calls[1].take, 26); assert.equal(calls[1].where.facility_id, id);
  assert.equal('actor_id' in calls[1].select, false); assert.equal('command_id' in calls[1].select, false);
  count = 0; assert.equal((await get()).data.hasMore, false);
  prisma.facility_audit_events.findMany = async () => { throw new Error('private DB detail'); };
  const failure = await get(); assert.equal(failure.status, 500); assert.equal(JSON.stringify(failure).includes('private DB detail'), false);
  console.log('PASS: history auth denials, validation, missing record, pagination, scoped query, private/no-store and sanitised failure');
})().catch(error => { console.error(error); process.exitCode = 1; });
