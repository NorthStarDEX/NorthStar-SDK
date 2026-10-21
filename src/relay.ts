import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import https from 'node:https';
import type { Socket } from 'node:net';

import type { Providers } from './internal/environment.js';

/**
 * Local Blockfrost relay for the SDK.
 *
 * The pinned Midnight wallet libraries print provider URLs when a connection
 * drops, so a project ID must never appear in a URL they receive. This relay
 * listens on loopback only, keeps the project ID in memory and sends it to
 * Blockfrost as a `project_id` header. Pass its `providers` to the SDK.
 */

export type RelayTargets = {
  nodeHttp: string;
  nodeWs: string;
  indexerHttp: string;
  indexerWs: string;
};

export type ProviderRelayOptions = {
  /** Blockfrost Midnight Mainnet project ID. */
  projectId: string;
  /**
   * Loopback port; 0 picks a free port. Defaults to 44201. Wallet checkpoints
   * stay valid only with the same providers, so keep the port fixed.
   */
  port?: number;
  /** Upstream endpoints. Only Blockfrost Mainnet hosts, or loopback http(s) for tests. */
  targets?: Partial<RelayTargets>;
};

export type ProviderRelay = {
  port: number;
  /** Pass these to the SDK as `providers`. */
  providers: Providers;
  close: () => Promise<void>;
};

export const BLOCKFROST_MAINNET_TARGETS: Readonly<RelayTargets> = Object.freeze({
  nodeHttp: 'https://rpc.midnight-mainnet.blockfrost.io/',
  nodeWs: 'wss://rpc.midnight-mainnet.blockfrost.io/',
  indexerHttp: 'https://midnight-mainnet.blockfrost.io/api/v0',
  indexerWs: 'wss://midnight-mainnet.blockfrost.io/api/v0/ws',
});

const BLOCKFROST_HOSTS = new Set(['rpc.midnight-mainnet.blockfrost.io', 'midnight-mainnet.blockfrost.io']);
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 30_000;
// Hop-by-hop and identity headers never cross the relay.
const DROPPED_UPGRADE_HEADERS = new Set([
  'host',
  'origin',
  'cookie',
  'authorization',
  'project_id',
  'proxy-authorization',
  'connection',
  'upgrade',
  'sec-websocket-extensions',
  'content-length',
  'transfer-encoding',
  'keep-alive',
]);

const checkTarget = (value: string, secure: 'https:' | 'wss:'): URL => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('relay_target_invalid');
  }
  if (url.username || url.password || url.search || url.hash) throw new Error('relay_target_invalid');
  const plain = secure === 'https:' ? 'http:' : 'ws:';
  if (BLOCKFROST_HOSTS.has(url.hostname) && url.protocol === secure && !url.port) return url;
  if (LOOPBACK_HOSTS.has(url.hostname) && [secure, plain].includes(url.protocol)) return url;
  throw new Error('relay_target_invalid');
};

const sendError = (
  response: ServerResponse,
  status: number,
  code: string,
  retryAfter?: string | string[],
): void => {
  if (response.headersSent) {
    response.destroy();
    return;
  }
  const headers: Record<string, string> = { 'content-type': 'application/json', 'cache-control': 'no-store' };
  if (typeof retryAfter === 'string' && /^\d{1,6}$/u.test(retryAfter)) headers['retry-after'] = retryAfter;
  response.writeHead(status, headers);
  response.end(JSON.stringify({ error: code }));
};

export const startProviderRelay = async (options: ProviderRelayOptions): Promise<ProviderRelay> => {
  const projectId = String(options?.projectId ?? '').trim();
  if (!/^[A-Za-z0-9_-]{8,128}$/u.test(projectId)) throw new Error('blockfrost_project_id_required');
  const port = options.port ?? 44201;
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('relay_port_invalid');
  const chosen = { ...BLOCKFROST_MAINNET_TARGETS, ...options.targets };
  const targets = {
    nodeHttp: checkTarget(chosen.nodeHttp, 'https:'),
    nodeWs: checkTarget(chosen.nodeWs, 'wss:'),
    indexerHttp: checkTarget(chosen.indexerHttp, 'https:'),
    indexerWs: checkTarget(chosen.indexerWs, 'wss:'),
  };
  const sockets = new Set<Socket>();
  let closing = false;

  // Browsers attach Origin/Sec-Fetch-Site; a pinned Host blocks DNS rebinding.
  const acceptable = (request: IncomingMessage): boolean =>
    !closing &&
    request.headers.origin == null &&
    request.headers['sec-fetch-site'] == null &&
    request.headers.host === `127.0.0.1:${(server.address() as { port: number } | null)?.port}`;

  const forward = (incoming: IncomingMessage, outgoing: ServerResponse, target: URL, body: Buffer): void => {
    const client = target.protocol === 'https:' ? https : http;
    const upstream = client.request(
      target,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': String(body.length),
          project_id: projectId,
        },
        timeout: UPSTREAM_TIMEOUT_MS,
      },
      (response) => {
        const status = response.statusCode ?? 502;
        if (status < 200 || status >= 300) {
          response.resume();
          sendError(
            outgoing,
            status === 402 || status === 429 || status === 418 ? status : 502,
            `upstream_http_${status}`,
            response.headers['retry-after'],
          );
          return;
        }
        outgoing.writeHead(status, {
          'content-type': String(response.headers['content-type'] ?? 'application/json'),
          'cache-control': 'no-store',
        });
        response.pipe(outgoing);
        response.on('error', () => outgoing.destroy());
      },
    );
    upstream.on('timeout', () => upstream.destroy(new Error('timeout')));
    upstream.on('error', () => sendError(outgoing, 502, 'upstream_unavailable'));
    // The request stream closes once its body is read; watch the response instead.
    outgoing.on('close', () => {
      if (!outgoing.writableFinished) upstream.destroy();
    });
    upstream.end(body);
  };

  const server = http.createServer((incoming, outgoing) => {
    if (!acceptable(incoming)) return sendError(outgoing, 403, 'forbidden');
    if (incoming.method !== 'POST' || !['/rpc', '/indexer'].includes(incoming.url ?? ''))
      return sendError(outgoing, 404, 'not_found');
    const chunks: Buffer[] = [];
    let size = 0;
    incoming.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        sendError(outgoing, 413, 'body_too_large');
        incoming.destroy();
        return;
      }
      chunks.push(chunk);
    });
    incoming.on('end', () => {
      if (size > MAX_BODY_BYTES) return;
      forward(
        incoming,
        outgoing,
        incoming.url === '/rpc' ? targets.nodeHttp : targets.indexerHttp,
        Buffer.concat(chunks),
      );
    });
  });
  server.headersTimeout = 10_000;
  server.requestTimeout = 60_000;
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  // WebSocket: forward the client's handshake with the project ID header, then
  // pipe raw bytes both ways. Frames are never parsed or logged.
  server.on('upgrade', (incoming, socket: Socket, head: Buffer) => {
    if (
      !acceptable(incoming) ||
      !['/rpc', '/indexer/ws'].includes(incoming.url ?? '') ||
      String(incoming.headers.upgrade ?? '').toLowerCase() !== 'websocket'
    ) {
      socket.destroy();
      return;
    }
    const target = incoming.url === '/rpc' ? targets.nodeWs : targets.indexerWs;
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (!DROPPED_UPGRADE_HEADERS.has(name) && typeof value === 'string') headers[name] = value;
    }
    const secure = target.protocol === 'wss:';
    const upstreamURL = new URL(target);
    upstreamURL.protocol = secure ? 'https:' : 'http:';
    const request = (secure ? https : http).request(upstreamURL, {
      method: 'GET',
      headers: { ...headers, connection: 'Upgrade', upgrade: 'websocket', project_id: projectId },
      timeout: UPSTREAM_TIMEOUT_MS,
    });
    request.on('upgrade', (response, upstream: Socket, upstreamHead: Buffer) => {
      const lines = [`HTTP/1.1 101 ${response.statusMessage ?? 'Switching Protocols'}`];
      for (let index = 0; index < response.rawHeaders.length; index += 2) {
        const name = response.rawHeaders[index];
        if (!/^set-cookie$/iu.test(name)) lines.push(`${name}: ${response.rawHeaders[index + 1]}`);
      }
      socket.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (upstreamHead.length > 0) socket.write(upstreamHead);
      if (head.length > 0) upstream.write(head);
      upstream.setTimeout(0);
      socket.setTimeout(0);
      sockets.add(upstream);
      upstream.on('close', () => {
        sockets.delete(upstream);
        socket.destroy();
      });
      socket.on('close', () => upstream.destroy());
      upstream.on('error', () => socket.destroy());
      socket.on('error', () => upstream.destroy());
      upstream.pipe(socket);
      socket.pipe(upstream);
    });
    request.on('response', (response) => {
      response.resume();
      socket.end(`HTTP/1.1 502 Bad Gateway\r\nconnection: close\r\ncontent-length: 0\r\n\r\n`);
    });
    request.on('timeout', () => request.destroy(new Error('timeout')));
    request.on('error', () => socket.destroy());
    socket.on('error', () => request.destroy());
    request.end();
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
  const bound = (server.address() as { port: number }).port;
  const base = `127.0.0.1:${bound}`;
  return {
    port: bound,
    providers: {
      node: `http://${base}/rpc`,
      nodeWs: `ws://${base}/rpc`,
      indexer: `http://${base}/indexer`,
      indexerWs: `ws://${base}/indexer/ws`,
    },
    close: async () => {
      closing = true;
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
};
