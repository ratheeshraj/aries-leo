import React from 'react';

// Responsive design utilities and constants

// Breakpoint constants
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Responsive container classes
export const CONTAINER_CLASSES = {
  base: 'container-responsive',
  fluid: 'w-full max-w-none px-4 sm:px-6 lg:px-8',
  constrained: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
} as const;

// Responsive grid patterns
export const GRID_CLASSES = {
  responsive: 'grid-responsive',
  products: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8',
  blog: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
} as const;

// Responsive text sizes
export const TEXT_SIZES = {
  heading: {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg',
  },
  body: {
    large: 'text-base sm:text-lg md:text-xl',
    normal: 'text-sm sm:text-base',
    small: 'text-xs sm:text-sm',
  },
  fluid: {
    hero: 'text-fluid-4xl',
    title: 'text-fluid-3xl',
    subtitle: 'text-fluid-2xl',
    heading: 'text-fluid-xl',
    body: 'text-fluid-base',
    caption: 'text-fluid-sm',
  },
} as const;

// Responsive spacing
export const SPACING = {
  section: 'py-8 sm:py-12 lg:py-16 xl:py-20',
  component: 'p-4 sm:p-6 lg:p-8',
  card: 'p-3 sm:p-4 lg:p-6',
  button: 'px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3',
} as const;

// Icon sizes for different breakpoints
export const ICON_SIZES = {
  xs: 'w-3 h-3 sm:w-4 sm:h-4',
  sm: 'w-4 h-4 sm:w-5 sm:h-5',
  md: 'w-5 h-5 sm:w-6 sm:h-6',
  lg: 'w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8',
  xl: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12',
} as const;

// Button responsive classes
export const BUTTON_CLASSES = {
  size: {
    sm: 'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm',
    md: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm',
    lg: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
  },
  responsive: 'btn-responsive',
  touchTarget: 'touch-target',
} as const;

// Helper functions
export const getResponsiveClasses = (base: string, responsive: Record<string, string>) => {
  const classes = [base];
  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (breakpoint === 'base') {
      classes.push(className);
    } else {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  return classes.join(' ');
};

export const createResponsiveText = (sizes: { base: string; sm?: string; md?: string; lg?: string; xl?: string }) => {
  let classes = sizes.base;
  if (sizes.sm) classes += ` sm:${sizes.sm}`;
  if (sizes.md) classes += ` md:${sizes.md}`;
  if (sizes.lg) classes += ` lg:${sizes.lg}`;
  if (sizes.xl) classes += ` xl:${sizes.xl}`;
  return classes;
};

// Media query hooks (for use with JavaScript)
export const useMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia(query);
  const [matches, setMatches] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  return matches;
};

export const useIsMobile = () => useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
export const useIsTablet = () => useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

// Common responsive patterns
export const RESPONSIVE_PATTERNS = {
  // Card layouts
  cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  cardGridLarge: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8',
  
  // Navigation
  navMenu: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6',
  mobileNav: 'fixed inset-x-0 top-0 z-50 bg-white shadow-lg transform transition-transform duration-300',
  
  // Content layouts
  sidebar: 'flex flex-col lg:flex-row gap-6 sm:gap-8',
  twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12',
  threeColumn: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Image and media
  heroImage: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10]',
  productImage: 'aspect-[3/4] w-full object-cover',
  avatar: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full',
  
  // Typography
  heroHeading: TEXT_SIZES.heading.h1,
  sectionHeading: TEXT_SIZES.heading.h2,
  cardTitle: TEXT_SIZES.heading.h4,
  bodyText: TEXT_SIZES.body.normal,
  caption: TEXT_SIZES.body.small,
} as const;

// Touch and accessibility improvements
export const TOUCH_IMPROVEMENTS = {
  target: 'min-h-[44px] min-w-[44px]', // Minimum touch target size
  feedback: 'active:scale-95 transition-transform',
  hover: 'hover:bg-gray-50 active:bg-gray-100',
} as const;

export default {
  BREAKPOINTS,
  CONTAINER_CLASSES,
  GRID_CLASSES,
  TEXT_SIZES,
  SPACING,
  ICON_SIZES,
  BUTTON_CLASSES,
  RESPONSIVE_PATTERNS,
  TOUCH_IMPROVEMENTS,
  getResponsiveClasses,
  createResponsiveText,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
};
