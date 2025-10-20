/**
 * Data Flow Optimization Utilities
 * Provides utilities for optimizing data flow and reducing unnecessary re-renders
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Debounce hook for optimizing API calls
 */
export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
}

/**
 * Throttle hook for limiting function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const lastCallRef = useRef<number>(0);

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastCallRef.current >= delay) {
                lastCallRef.current = now;
                callback(...args);
            }
        }) as T,
        [callback, delay]
    );
}

/**
 * Memoized selector for complex state computations
 */
export function useMemoizedSelector<T, R>(
    selector: (state: T) => R,
    state: T,
    deps: React.DependencyList = []
): R {
    return useMemo(() => selector(state), [state, ...deps]);
}

/**
 * Optimized callback that only changes when dependencies change
 */
export function useStableCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
): T {
    const callbackRef = useRef(callback);
    const depsRef = useRef(deps);

    // Update callback ref when dependencies change
    useEffect(() => {
        callbackRef.current = callback;
        depsRef.current = deps;
    }, [callback, ...deps]);

    return useCallback(
        ((...args: Parameters<T>) => {
            return callbackRef.current(...args);
        }) as T,
        []
    );
}

/**
 * Batch state updates to prevent multiple re-renders
 */
export function useBatchedUpdates() {
    const batchRef = useRef<(() => void)[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const batch = useCallback((update: () => void) => {
        batchRef.current.push(update);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const updates = batchRef.current;
            batchRef.current = [];

            // Execute all updates
            updates.forEach(update => update());
        }, 0);
    }, []);

    return batch;
}

/**
 * Optimized data fetching with caching
 */
export function useOptimizedFetch<T>(
    fetchFn: () => Promise<T>,
    cacheKey: string,
    ttl: number = 5 * 60 * 1000, // 5 minutes
    deps: React.DependencyList = []
) {
    const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
    const loadingRef = useRef<boolean>(false);
    const promiseRef = useRef<Promise<T> | null>(null);

    const fetchData = useCallback(async (forceRefresh = false): Promise<T> => {
        const now = Date.now();
        const cached = cacheRef.current.get(cacheKey);

        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && cached && (now - cached.timestamp) < ttl) {
            return cached.data;
        }

        // Return existing promise if already fetching
        if (loadingRef.current && promiseRef.current) {
            return promiseRef.current;
        }

        // Create new fetch promise
        loadingRef.current = true;
        promiseRef.current = fetchFn().then(data => {
            // Cache the result
            cacheRef.current.set(cacheKey, { data, timestamp: now });
            loadingRef.current = false;
            promiseRef.current = null;
            return data;
        }).catch(error => {
            loadingRef.current = false;
            promiseRef.current = null;
            throw error;
        });

        return promiseRef.current;
    }, [fetchFn, cacheKey, ttl, ...deps]);

    const clearCache = useCallback(() => {
        cacheRef.current.delete(cacheKey);
    }, [cacheKey]);

    return { fetchData, clearCache };
}

/**
 * Optimized list rendering with virtualization support
 */
export function useOptimizedList<T>(
    items: T[],
    keyExtractor: (item: T, index: number) => string,
    options: {
        pageSize?: number;
        initialPage?: number;
        onPageChange?: (page: number) => void;
    } = {}
) {
    const { pageSize = 20, initialPage = 0, onPageChange } = options;
    const [currentPage, setCurrentPage] = React.useState(initialPage);

    const paginatedItems = useMemo(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return items.slice(start, end);
    }, [items, currentPage, pageSize]);

    const totalPages = useMemo(() => {
        return Math.ceil(items.length / pageSize);
    }, [items.length, pageSize]);

    const hasNextPage = useMemo(() => {
        return currentPage < totalPages - 1;
    }, [currentPage, totalPages]);

    const hasPreviousPage = useMemo(() => {
        return currentPage > 0;
    }, [currentPage]);

    const goToPage = useCallback((page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            onPageChange?.(page);
        }
    }, [totalPages, onPageChange]);

    const nextPage = useCallback(() => {
        if (hasNextPage) {
            goToPage(currentPage + 1);
        }
    }, [hasNextPage, currentPage, goToPage]);

    const previousPage = useCallback(() => {
        if (hasPreviousPage) {
            goToPage(currentPage - 1);
        }
    }, [hasPreviousPage, currentPage, goToPage]);

    return {
        items: paginatedItems,
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        goToPage,
        nextPage,
        previousPage,
        totalItems: items.length,
    };
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
    const renderCountRef = useRef(0);
    const lastRenderTimeRef = useRef<number>(0);

    useEffect(() => {
        renderCountRef.current += 1;
        const now = Date.now();

        if (lastRenderTimeRef.current > 0) {
            const timeSinceLastRender = now - lastRenderTimeRef.current;
            console.log(`${componentName} rendered ${renderCountRef.current} times, ${timeSinceLastRender}ms since last render`);
        }

        lastRenderTimeRef.current = now;
    });

    return {
        renderCount: renderCountRef.current,
    };
}
