import assert from 'node:assert/strict'
import test from 'node:test'

import { onRequest } from '../functions/_middleware.js'

function createContext(pathname, assets = new Map(), method = 'GET') {
  const fetchedPaths = []
  let nextCalls = 0

  return {
    context: {
      request: new Request(`https://post.example${pathname}`, { method }),
      env: {
        ASSETS: {
          async fetch(input) {
            const url = new URL(input instanceof Request ? input.url : input)
            fetchedPaths.push(url.pathname)
            const asset = assets.get(url.pathname)

            if (asset) {
              return new Response(asset.body, {
                headers: { 'Content-Type': asset.contentType },
              })
            }

            return new Response('<!doctype html><div id="root"></div>', {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
          },
        },
      },
      async next() {
        nextCalls += 1
        return new Response('react-spa', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      },
    },
    fetchedPaths,
    get nextCalls() {
      return nextCalls
    },
  }
}

test('returns cfg bytes as a raw plain-text HTTP response', async () => {
  const fixture = createContext(
    '/puretext/post-training-admin',
    new Map([
      [
        '/pureTextFiles/post-training-admin.cfg',
        { body: 'admin=true\n', contentType: 'application/octet-stream' },
      ],
    ]),
  )

  const response = await onRequest(fixture.context)

  assert.equal(await response.text(), 'admin=true\n')
  assert.equal(response.headers.get('Content-Type'), 'text/plain; charset=utf-8')
  assert.deepEqual(fixture.fetchedPaths, [
    '/pureTextFiles/post-training-admin.txt',
    '/pureTextFiles/post-training-admin.cfg',
  ])
  assert.equal(fixture.nextCalls, 0)
})

test('prefers txt when txt and cfg files share a name', async () => {
  const fixture = createContext(
    '/PureText/config',
    new Map([
      ['/pureTextFiles/config.txt', { body: 'txt', contentType: 'text/plain' }],
      [
        '/pureTextFiles/config.cfg',
        { body: 'cfg', contentType: 'application/octet-stream' },
      ],
    ]),
  )

  const response = await onRequest(fixture.context)

  assert.equal(await response.text(), 'txt')
  assert.deepEqual(fixture.fetchedPaths, ['/pureTextFiles/config.txt'])
})

test('accepts an explicit cfg extension', async () => {
  const fixture = createContext(
    '/pureText/config.cfg',
    new Map([
      [
        '/pureTextFiles/config.cfg',
        { body: 'cfg', contentType: 'application/octet-stream' },
      ],
    ]),
  )

  const response = await onRequest(fixture.context)

  assert.equal(await response.text(), 'cfg')
  assert.deepEqual(fixture.fetchedPaths, ['/pureTextFiles/config.cfg'])
})

test('delegates missing files to the React SPA', async () => {
  const fixture = createContext('/pureText/missing')

  const response = await onRequest(fixture.context)

  assert.equal(await response.text(), 'react-spa')
  assert.equal(fixture.nextCalls, 1)
})

test('delegates unrelated routes and non-GET requests', async () => {
  const unrelated = createContext('/rules')
  const post = createContext('/pureText/config', new Map(), 'POST')

  assert.equal(await (await onRequest(unrelated.context)).text(), 'react-spa')
  assert.equal(await (await onRequest(post.context)).text(), 'react-spa')
  assert.deepEqual(unrelated.fetchedPaths, [])
  assert.deepEqual(post.fetchedPaths, [])
})
