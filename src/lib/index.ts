// =============================================================================
// LIB INDEX - DOTT. BERNARDO GIAMMETTA
// Export centralizzato di tutte le utilities
// =============================================================================

// =============================================================================
// CORE UTILITIES
// =============================================================================
export { cn } from './utils';

// =============================================================================
// DATABASE
// =============================================================================
export { db } from './db';
export {
  withRetry,
  withTransaction,
  checkDbHealth,
  ensureConnection,
  safePagination,
  safeOrderBy,
  safeSearch,
  safeDateFilter,
  batchOperation,
  safeUpsert,
} from './db-utils';

// =============================================================================
// AUTHENTICATION
// =============================================================================
export { authOptions } from './auth';
export { isMasterAccount, MASTER_ACCOUNTS } from './config';

// =============================================================================
// SECURITY
// =============================================================================
export {
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  checkRateLimit,
  verifyAuth,
  requireAuth,
  requireAdmin,
  getClientIP,
  verifyContentType,
  verifyBodySize,
  errorResponse,
  successResponse,
  logSecurityEvent,
  verifyOrigin,
} from './security';

// =============================================================================
// ERROR HANDLING
// =============================================================================
export {
  ErrorCode,
  ApiError,
  Errors,
  handleError,
  withErrorHandler,
  tryCatch,
} from './error-handler';

// =============================================================================
// CACHING
// =============================================================================
export {
  cache,
  withCache,
  invalidateCache,
  CacheKeys,
  CacheTTL,
  memoize,
  memoizeAsync,
} from './cache';

// =============================================================================
// VALIDATION
// =============================================================================
export {
  patterns,
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  registerFormSchema,
  loginFormSchema,
  contactFormSchema,
  profileFormSchema,
  bookingFormSchema,
  isValidEmail,
  isValidPhone,
  isValidCodiceFiscale,
  isValidPartitaIva,
  calculatePasswordStrength,
  formatPhone,
  formatCodiceFiscale,
} from './form-validation';

// =============================================================================
// LOGGING
// =============================================================================
export {
  logger,
  apiLogger,
  dbLogger,
  authLogger,
  emailLogger,
  createLogger,
} from './logger';

// =============================================================================
// AGENDA
// =============================================================================
export {
  STUDIO_HOURS,
  SLOT_DURATION,
  VISIT_DURATION,
  MIN_BOOKING_NOTICE_HOURS,
  generateBaseTimeSlots,
  getDayAvailability,
  canUserBook,
  createAppointment,
  cancelAppointment,
  createRecurringBlock,
  createOccasionalBlock,
  removeTimeBlock,
  getWeekAvailability,
  formatAppointmentForDisplay,
} from './agenda';

// =============================================================================
// ITALIAN HOLIDAYS
// =============================================================================
export {
  calculateEaster,
  calculateEasterMonday,
  isItalianHoliday,
  isSunday,
  getHolidaysForYear,
  formatHolidaysList,
  HOLIDAY_NAMES,
} from './italian-holidays';

// =============================================================================
// CONSTANTS
// =============================================================================
export {
  ROUTES,
  ROLES,
  PERMISSIONS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  LIMITS,
  REGEX,
  MESSAGES,
} from './constants';
