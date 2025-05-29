// modules/redis/redis.ts
import Redis from 'ioredis';
import { APP_CONFIG } from '@/config/envConfig';

// In-memory cache as fallback
class MemoryCache {
  private cache = new Map<string, string>();

  async get(key: string) {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, mode?: string, duration?: number) {
    this.cache.set(key, value);
    if (mode === 'EX' && duration) {
      setTimeout(() => this.cache.delete(key), duration * 1000);
    }
    return 'OK';
  }
}

// Initialize with fallback to memory cache
let redisClient: Redis | MemoryCache;

try {
  // Try to create Redis client
  redisClient = new Redis(APP_CONFIG.REDIS.URL || 'redis://localhost:6379', {
    connectTimeout: 5000, // 5 seconds timeout
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  // Add event handlers
  redisClient.on('error', (err) => {
    console.warn('Redis error, falling back to in-memory cache:', err.message);
    redisClient = new MemoryCache();
  });

  redisClient.on('connect', () => {
    console.log('Successfully connected to Redis');
  });

  // Test connection
  redisClient.ping().catch((err) => {
    console.warn('Redis ping failed, using in-memory cache:', err.message);
    redisClient = new MemoryCache();
  });
} catch (error) {
  console.warn('Failed to initialize Redis, using in-memory cache:', error);
  redisClient = new MemoryCache();
}

// Export as redis to maintain compatibility with existing code
export const redis = redisClient;
