import { useState, useEffect, useRef } from 'react';

/**
 * Returns a debounced version of `value` that only updates
 * after the user has stopped typing for `delay` ms.
 * Prevents expensive filter/search from running on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * Stores the previous value of any reactive value.
 * Useful for detecting what changed between renders.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current;
}

/**
 * Calls `fn` once, on the next idle period (after paint).
 * Use for non-critical initialisation (analytics, prefetch, etc.)
 */
export function useIdleEffect(fn: () => void, deps: unknown[]) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(fn);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(fn, 200);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
