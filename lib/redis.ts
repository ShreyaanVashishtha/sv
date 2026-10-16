import { Redis } from '@upstash/redis';

// Auto-detect Vercel KV or Upstash Redis environment credentials
const url =
  process.env.STORAGE_REST_API_URL ||
  process.env.STORAGE_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  process.env.REDIS_URL;

const token =
  process.env.STORAGE_REST_API_TOKEN ||
  process.env.STORAGE_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.REDIS_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export const isRedisConfigured = !!redis;
