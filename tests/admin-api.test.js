import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ cacheDir: 'node_modules/.vite-tests', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
after(() => vite.close())
const { request } = await vite.ssrLoadModule('/src/utils/request.tsx')
const api = await vite.ssrLoadModule('/src/apis/serverAdmin.tsx')

test('all admin operations send cookie credentials and use migrated routes', async () => {
  const calls = []
  request.defaults.adapter = async config => {
    calls.push(config)
    return { data: { data: true }, status: 200, statusText: 'OK', headers: {}, config }
  }
  const credentials = { email: 'admin@example.com', password: 'Abc123!' }
  await api.usernameCheckAPI({ email: credentials.email })
  await api.serverAdminRegisterAPI(credentials)
  await api.serverAdminRegisterValidationAPI({ email: credentials.email, token: 'otp' })
  await api.serverAdminLoginAPI(credentials)
  await api.getCurrentAdminAPI()
  await api.serverAdminLogoutAPI()
  await api.adminBindingAPI()
  await api.adminUnbindingAPI()
  assert.deepEqual(calls.map(c => [c.method, c.url]), [
    ['post', '/post/admin/register/valid-email'], ['post', '/post/admin/register/init'],
    ['post', '/post/admin/register/validate'], ['post', '/post/admin/login'],
    ['get', '/post/admin/current'], ['post', '/post/admin/logout'],
    ['post', '/post/admin/binding'], ['delete', '/post/admin/binding'],
  ])
  assert.ok(calls.every(c => c.withCredentials === true))
  assert.deepEqual(JSON.parse(calls[3].data), credentials)
  assert.deepEqual(JSON.parse(calls[2].data), { email: credentials.email, token: 'otp' })
})

test('401 errors reach callers without invoking React hooks', async () => {
  const unauthorized = { response: { status: 401, data: {} } }
  request.defaults.adapter = async () => { throw unauthorized }
  await assert.rejects(api.getCurrentAdminAPI(), error => error === unauthorized)
})

test('registration rejects passwords the API rejects, including bcrypt byte overflow', async () => {
  const { passwordValidationError: validate } = await vite.ssrLoadModule('/src/utils/password.ts')
  assert.equal(validate('Abc123!'), null)
  assert.equal(validate('Abc123_'), 'passwordMustContainSpecialChar')
  assert.equal(validate('abc123!'), 'passwordMustContainUppercase')
  assert.equal(validate('ABC123!'), 'passwordMustContainLowercase')
  assert.equal(validate('Ab!12'), 'passwordNotLessThan6')
  assert.equal(validate('Ab!' + 'x'.repeat(69)), null)
  assert.equal(validate('Ab!' + 'x'.repeat(70)), 'passwordTooLong')
  assert.equal(validate('Ab!' + '中'.repeat(24)), 'passwordTooLong')
})
