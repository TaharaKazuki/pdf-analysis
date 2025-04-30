import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

import { RATE_LIMIT } from './constant';
import { ApiError } from './error';

const defaultCache = new LRUCache({
  max: RATE_LIMIT.CACHE_MAX_SIZE,
  ttl: RATE_LIMIT.CACHE_TTL_MS,
});

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  cache?: LRUCache<string, number>;
  identifierFn?: (req: NextRequest) => string;
}

export const getIdentifier = (req: NextRequest): string => {
  return req.headers.get('x-forwarded-for') || '127.0.0.1';
};

export const rateLimiter = async (
  req: NextRequest,
  options?: RateLimitOptions
) => {
  const cache = options?.cache ?? defaultCache;
  const maxRequests = options?.maxRequests ?? RATE_LIMIT.REQUESTS_PER_MINUTE;
  const windowMs = options?.windowMs ?? RATE_LIMIT.CACHE_TTL_MS;
  const getIdFn = options?.identifierFn ?? getIdentifier;

  const identifier = getIdFn(req);
  const currentCount = (cache.get(identifier) as number) || 0;

  if (currentCount >= maxRequests) {
    throw new ApiError(429, 'Rate limit exceeded. Please try again later.', {
      limitResetTime: new Date(Date.now() + windowMs).toISOString(),
      remaining: 0,
      limit: maxRequests,
    });
  }

  cache.set(identifier, currentCount + 1);
};
