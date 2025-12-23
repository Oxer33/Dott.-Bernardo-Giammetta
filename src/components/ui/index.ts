// =============================================================================
// UI COMPONENTS INDEX - DOTT. BERNARDO GIAMMETTA
// Export centralizzato di tutti i componenti UI
// =============================================================================

// =============================================================================
// BUTTONS & ACTIONS
// =============================================================================
export { Button } from './Button';
export type { ButtonProps } from './Button';

// =============================================================================
// FORM COMPONENTS
// =============================================================================
export { FormInput, FormTextarea, FormCheckbox } from './FormInput';
export type { FormInputProps, FormTextareaProps, FormCheckboxProps } from './FormInput';

export { Select, RadioGroup } from './Select';
export type { SelectProps, SelectOption, RadioOption, RadioGroupProps } from './Select';

export { SearchInput, SearchWithSuggestions } from './SearchInput';

// =============================================================================
// FEEDBACK & NOTIFICATIONS
// =============================================================================
export { 
  LoadingSpinner, 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  PageLoader 
} from './LoadingSpinner';

export { 
  ErrorMessage, 
  EmptyState, 
  ApiError, 
  FormError, 
  FieldError 
} from './ErrorMessage';
export type { MessageType } from './ErrorMessage';

export { ToastProvider, useToast, useToastActions, StandaloneToast } from './Toast';
export type { Toast, ToastType } from './Toast';

export { ConfirmDialog, ConfirmProvider, useConfirm, useConfirmDialog } from './ConfirmDialog';
export type { ConfirmOptions, ConfirmVariant } from './ConfirmDialog';

// =============================================================================
// LAYOUT & CONTAINERS
// =============================================================================
export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  StatCard,
  FeatureCard,
  ProfileCard
} from './Card';
export type { CardProps } from './Card';

export { Modal, ModalFooter, Drawer } from './Modal';
export type { ModalProps } from './Modal';

// =============================================================================
// NAVIGATION & TABS
// =============================================================================
export { Tabs, TabsList, TabTrigger, TabContent, SimpleTabs } from './Tabs';

export { Pagination, usePagination } from './Pagination';

// =============================================================================
// DATA DISPLAY
// =============================================================================
export { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent,
  SimpleAccordion,
  FAQAccordion
} from './Accordion';

export { Tooltip, InfoTooltip, Badge, StatusDot } from './Tooltip';

// =============================================================================
// MEDIA
// =============================================================================
export { 
  OptimizedImage, 
  AvatarImage, 
  BackgroundImage, 
  GalleryImage 
} from './OptimizedImage';

// =============================================================================
// OTHER UI COMPONENTS
// =============================================================================
export { ScrollToTop } from './ScrollToTop';
export { CookieConsent } from './CookieConsent';
export { SplashScreen } from './SplashScreen';
export { Breadcrumbs } from './Breadcrumbs';
