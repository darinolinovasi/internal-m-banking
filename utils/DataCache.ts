/**
 * Data Caching and Persistence Layer
 * Provides intelligent caching with TTL and persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T = any> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

export interface CacheConfig {
    ttl: number; // Default TTL in milliseconds
    persist: boolean; // Whether to persist to storage
    key: string; // Storage key
}

class DataCache {
    private memoryCache = new Map<string, CacheItem>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
    private readonly PERSISTENT_TTL = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Set data in cache
     */
    async set<T>(
        key: string,
        data: T,
        config: Partial<CacheConfig> = {}
    ): Promise<void> {
        const cacheConfig: CacheConfig = {
            ttl: config.ttl || this.DEFAULT_TTL,
            persist: config.persist || false,
            key: config.key || key,
        };

        const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl: cacheConfig.ttl,
        };

        // Store in memory
        this.memoryCache.set(key, cacheItem);

        // Persist to storage if configured
        if (cacheConfig.persist) {
            try {
                await AsyncStorage.setItem(
                    `cache_${cacheConfig.key}`,
                    JSON.stringify(cacheItem)
                );
            } catch (error) {
                console.warn('Failed to persist cache item:', error);
            }
        }
    }

    /**
     * Get data from cache
     */
    async get<T>(key: string): Promise<T | null> {
        // Check memory cache first
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem && this.isValid(memoryItem)) {
            return memoryItem.data as T;
        }

        // Check persistent storage
        try {
            const storedItem = await AsyncStorage.getItem(`cache_${key}`);
            if (storedItem) {
                const cacheItem: CacheItem<T> = JSON.parse(storedItem);
                if (this.isValid(cacheItem)) {
                    // Restore to memory cache
                    this.memoryCache.set(key, cacheItem);
                    return cacheItem.data;
                } else {
                    // Remove expired item
                    await AsyncStorage.removeItem(`cache_${key}`);
                }
            }
        } catch (error) {
            console.warn('Failed to retrieve cache item:', error);
        }

        return null;
    }

    /**
     * Check if cache item is valid (not expired)
     */
    private isValid(item: CacheItem): boolean {
        return Date.now() - item.timestamp < item.ttl;
    }

    /**
     * Remove item from cache
     */
    async remove(key: string): Promise<void> {
        this.memoryCache.delete(key);
        try {
            await AsyncStorage.removeItem(`cache_${key}`);
        } catch (error) {
            console.warn('Failed to remove cache item:', error);
        }
    }

    /**
     * Clear all cache
     */
    async clear(): Promise<void> {
        this.memoryCache.clear();
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('cache_'));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.warn('Failed to clear cache:', error);
        }
    }

    /**
     * Clear expired items
     */
    async clearExpired(): Promise<void> {
        const now = Date.now();

        // Clear expired memory cache
        for (const [key, item] of this.memoryCache.entries()) {
            if (now - item.timestamp >= item.ttl) {
                this.memoryCache.delete(key);
            }
        }

        // Clear expired persistent cache
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('cache_'));

            for (const key of cacheKeys) {
                const storedItem = await AsyncStorage.getItem(key);
                if (storedItem) {
                    const cacheItem: CacheItem = JSON.parse(storedItem);
                    if (now - cacheItem.timestamp >= cacheItem.ttl) {
                        await AsyncStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to clear expired cache:', error);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): {
        memoryItems: number;
        memorySize: number;
    } {
        return {
            memoryItems: this.memoryCache.size,
            memorySize: JSON.stringify(Array.from(this.memoryCache.entries())).length,
        };
    }

    /**
     * Preload data from storage
     */
    async preload(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('cache_'));

            for (const key of cacheKeys) {
                const storedItem = await AsyncStorage.getItem(key);
                if (storedItem) {
                    const cacheItem: CacheItem = JSON.parse(storedItem);
                    if (this.isValid(cacheItem)) {
                        const originalKey = key.replace('cache_', '');
                        this.memoryCache.set(originalKey, cacheItem);
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to preload cache:', error);
        }
    }
}

// Singleton instance
export const dataCache = new DataCache();

// Cache keys constants
export const CACHE_KEYS = {
    USER: 'user',
    ACCOUNT: 'account',
    TRANSACTIONS: 'transactions',
    SAVED_ACCOUNTS: 'saved_accounts',
    RECENT_TRANSACTIONS: 'recent_transactions',
} as const;

// Cache configurations
export const CACHE_CONFIGS = {
    USER: { ttl: 24 * 60 * 60 * 1000, persist: true }, // 24 hours
    ACCOUNT: { ttl: 5 * 60 * 1000, persist: true }, // 5 minutes
    TRANSACTIONS: { ttl: 10 * 60 * 1000, persist: true }, // 10 minutes
    SAVED_ACCOUNTS: { ttl: 30 * 60 * 1000, persist: true }, // 30 minutes
    RECENT_TRANSACTIONS: { ttl: 5 * 60 * 1000, persist: false }, // 5 minutes, memory only
} as const;
