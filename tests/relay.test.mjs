import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import http from 'node:http';
import test from 'node:test';
import { startProviderRelay } from '../dist/relay.js';
import { providerEnvironment } from '../dist/internal/environment.js';

const PROJECT = 'mainnetFixtureProject0123456789';

// Synthetic upstream: echoes JSON-RPC bodies, records headers, answers one WebSocket path.
const startUpstream = async () => {
  const seen = [];
  const server = http.createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      seen.push({ url: request.url, headers: request.headers, body });
      if (request.url === '/quota') {
        response.writeHead(402, { 'retry-after': '60', 'set-cookie': 'x=1' });
        response.end('{"secret":"upstream"}');
        return;
      }
      response.writeHead(200, { 'content-type': 'application/json', 'set-cookie': 'x=1' });
      response.end(JSON.stringify({ jsonrpc: '2.0', id: 1, result: 'ok', path: request.url }));
    });
  });
  const upgraded = new Set();
  server.on('upgrade', (request, socket) => {
    upgraded.add(socket);
    seen.push({ url: request.url, headers: request.headers, upgrade: true });
    const accept = createHash('sha1')
      .update(`${request.headers['sec-websocket-key']}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest('base64');
    const protocol = request.headers['sec-websocket-protocol']
      ? `Sec-WebSocket-Protocol: ${request.headers['sec-websocket-protocol'].split(',')[0].trim()}\r\n`
      : '';
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n${protocol}\r\n`,
    );
    socket.write(Buffer.concat([Buffer.from([0x81, 5]), Buffer.from('hello')]));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `127.0.0.1:${server.address().port}`;
  return {
    seen,
    base,
    close: () =>
      new Promise((resolve) => {
        for (const socket of upgraded) socket.destroy();
        server.closeAllConnections();
        server.close(resolve);
      }),
  };
};

const withRelay = async (fn) => {
  const upstream = await startUpstream();
  const relay = await startProviderRelay({
    projectId: PROJECT,
    port: 0,
    targets: {
      nodeHttp: `http://${upstream.base}/node`,
      nodeWs: `ws://${upstream.base}/node-ws`,
      indexerHttp: `http://${upstream.base}/indexer`,
      indexerWs: `ws://${upstream.base}/indexer-ws`,
    },
  });
  try {
    await fn({ relay, upstream });
  } finally {
    await relay.close();
    await upstream.close();
  }
};

test('relay forwards HTTP with the project ID header and exposes only credential-free URLs', async () => {
  await withRelay(async ({ relay, upstream }) => {
    assert.deepEqual(Object.keys(relay.providers).sort(), ['indexer', 'indexerWs', 'node', 'nodeWs']);
    for (const value of Object.values(relay.providers)) {
      assert.equal(value.includes(PROJECT), false);
      assert.match(value, /^(?:http|ws):\/\/127\.0\.0\.1:\d+\//u);
    }
    providerEnvironment(relay.providers);
    for (const [route, expected] of [
      ['rpc', '/node'],
      ['indexer', '/indexer'],
    ]) {
      const response = await fetch(`http://127.0.0.1:${relay.port}/${route}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"id":1}',
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('set-cookie'), null);
      assert.equal((await response.json()).path, expected);
      const request = upstream.seen.at(-1);
      assert.equal(request.headers.project_id, PROJECT);
      assert.equal(request.body, '{"id":1}');
      assert.equal(request.url.includes(PROJECT), false);
    }
  });
});

test('relay forwards WebSocket handshakes and bytes for node and indexer', async () => {
  await withRelay(async ({ relay, upstream }) => {
    for (const [route, expected] of [
      ['rpc', '/node-ws'],
      ['indexer/ws', '/indexer-ws'],
    ]) {
      const socket = new WebSocket(`ws://127.0.0.1:${relay.port}/${route}`, ['graphql-transport-ws']);
      const message = await new Promise((resolve, reject) => {
        socket.onmessage = (event) => resolve(event.data);
        socket.onerror = () => reject(new Error('websocket_failed'));
      });
      assert.equal(message, 'hello');
      assert.equal(socket.protocol, 'graphql-transport-ws');
      socket.close();
      const handshake = upstream.seen.filter((entry) => entry.upgrade).at(-1);
      assert.equal(handshake.url, expected);
      assert.equal(handshake.headers.project_id, PROJECT);
      assert.equal(handshake.headers.origin, undefined);
    }
  });
});

test('relay refuses browser origins, rebinding hosts, unknown routes and GET', async () => {
  await withRelay(async ({ relay, upstream }) => {
    const url = `http://127.0.0.1:${relay.port}`;
    const before = upstream.seen.length;
    const post = (path, headers = {}) =>
      new Promise((resolve, reject) => {
        const request = http.request(
          `${url}${path}`,
          { method: 'POST', headers: { 'content-type': 'application/json', ...headers } },
          (response) => {
            response.resume();
            resolve(response.statusCode);
          },
        );
        request.on('error', reject);
        request.end('{}');
      });
    assert.equal(await post('/rpc', { origin: 'https://evil.example' }), 403);
    assert.equal(await post('/rpc', { host: 'evil.example' }), 403);
    assert.equal(await post('/rpc', { 'sec-fetch-site': 'cross-site' }), 403);
    assert.equal(await post('/other'), 404);
    assert.equal((await fetch(`${url}/rpc`)).status, 404);
    assert.equal(upstream.seen.length, before);
  });
});

test('relay maps quota limits without leaking upstream bodies', async () => {
  const upstream = await startUpstream();
  const relay = await startProviderRelay({
    projectId: PROJECT,
    port: 0,
    targets: {
      nodeHttp: `http://${upstream.base}/quota`,
      nodeWs: `ws://${upstream.base}/x`,
      indexerHttp: `http://${upstream.base}/x`,
      indexerWs: `ws://${upstream.base}/x`,
    },
  });
  try {
    const response = await fetch(`http://127.0.0.1:${relay.port}/rpc`, { method: 'POST', body: '{}' });
    assert.equal(response.status, 402);
    assert.equal(response.headers.get('retry-after'), '60');
    assert.deepEqual(await response.json(), { error: 'upstream_http_402' });
  } finally {
    await relay.close();
    await upstream.close();
  }
});

test('relay requires a project ID option and only Blockfrost or loopback targets', async () => {
  const saved = process.env.BLOCKFROST_MAINNET_PROJECT_ID;
  process.env.BLOCKFROST_MAINNET_PROJECT_ID = PROJECT;
  try {
    await assert.rejects(() => startProviderRelay({ port: 0 }), /blockfrost_project_id_required/);
    await assert.rejects(() => startProviderRelay(), /blockfrost_project_id_required/);
    for (const nodeHttp of [
      'https://evil.example/',
      'http://rpc.midnight-mainnet.blockfrost.io/',
      'https://rpc.midnight-mainnet.blockfrost.io/?x=1',
      'https://rpc.midnight-mainnet.blockfrost.io:8443/',
    ]) {
      await assert.rejects(
        () => startProviderRelay({ projectId: PROJECT, port: 0, targets: { nodeHttp } }),
        /relay_target_invalid/,
      );
    }
  } finally {
    if (saved == null) delete process.env.BLOCKFROST_MAINNET_PROJECT_ID;
    else process.env.BLOCKFROST_MAINNET_PROJECT_ID = saved;
  }
});
