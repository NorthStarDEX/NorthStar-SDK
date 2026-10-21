import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { HexInput } from './types.js';

export const normalizeHex = (value: HexInput, label = 'hex'): string => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/^0x/iu, '')
    .toLowerCase();
  if (normalized.length === 0 || normalized.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(normalized)) {
    throw new Error(`invalid_${label}`);
  }
  return normalized;
};

export const normalizeBytes32Hex = (value: HexInput, label = 'bytes32'): string => {
  const normalized = normalizeHex(value, label);
  if (normalized.length !== 64) {
    throw new Error(`invalid_${label}_length:${normalized.length / 2}:expected_32`);
  }
  return normalized;
};

export const bytesFromHex = (
  value: HexInput,
  label = 'hex',
  expectedLength: number | null = null,
): Uint8Array => {
  const hex = normalizeHex(value, label);
  const bytes = Uint8Array.from(Buffer.from(hex, 'hex'));
  if (expectedLength != null && bytes.length !== expectedLength) {
    throw new Error(`invalid_${label}_length:${bytes.length}:expected_${expectedLength}`);
  }
  return bytes;
};

export const bytes32FromHex = (value: HexInput, label = 'bytes32'): Uint8Array =>
  bytesFromHex(value, label, 32);

export const hexFromBytes = (value: HexInput): string => {
  if (typeof value === 'string') return normalizeHex(value);
  const record = value != null && typeof value === 'object' && !(value instanceof Uint8Array) ? value : {};
  const bytes =
    'bytes' in record && record.bytes instanceof Uint8Array
      ? record.bytes
      : 'raw' in record && record.raw instanceof Uint8Array
        ? record.raw
        : value;
  if (bytes == null) return '';
  if (bytes instanceof Uint8Array) return Buffer.from(bytes).toString('hex');
  if (typeof bytes === 'object' && 'length' in bytes)
    return Buffer.from(Uint8Array.from(bytes as ArrayLike<number>)).toString('hex');
  return '';
};

export const sha256Hex = (value: string | Buffer | Uint8Array): string =>
  createHash('sha256').update(value).digest('hex');
export const sha256File = (filePath: string): string => `sha256:${sha256Hex(readFileSync(filePath))}`;

export const projectPath = (...parts: string[]): string =>
  path.resolve(fileURLToPath(new URL('../..', import.meta.url)), ...parts);
