// =============================================================================
// HOOKS INDEX - DOTT. BERNARDO GIAMMETTA
// Export centralizzato di tutti gli hooks custom
// =============================================================================

// API hooks
export { useApi, useMutation, clearApiCache } from './useApi';
export type { ApiState, UseApiOptions } from './useApi';

// Utility hooks
export {
  useDebounce,
  useDebounceCallback,
  useThrottle,
  useLocalStorage,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useClickOutside,
  useIntersectionObserver,
} from './useDebounce';
