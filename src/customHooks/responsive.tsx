import { useMediaQuery } from "react-responsive";

/**
 * Centralized breakpoint definitions for consistent responsive design
 *
 * @remarks
 * These breakpoints follow a mobile-first approach:
 * - Small Mobile (iPhone 6, etc): 0-375px
 * - Mobile: 376-768px
 * - Tablet: 769-1024px
 * - Desktop: 1025px+
 */
const breakpoints = {
  smallMobile: "(max-width: 375px)", // iPhone 6, 6s, 7, 8, SE
  mobile: "(max-width: 768px)",
  tablet: "(min-width: 769px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
  largeDesktop: "(min-width: 1440px)",
};

/**
 * Custom hook for responsive design breakpoint detection
 *
 * This hook provides a clean interface for detecting different screen sizes
 * using CSS media queries. It returns boolean values for each breakpoint.
 *
 * @returns {Object} An object containing boolean values for each breakpoint
 * @returns {boolean} returns.isSmallMobile - True when screen width is ≤ 375px (iPhone 6, etc)
 * @returns {boolean} returns.isMobile - True when screen width is ≤ 768px
 * @returns {boolean} returns.isTablet - True when screen width is 769-1024px
 * @returns {boolean} returns.isDesktop - True when screen width is ≥ 1025px
 * @returns {boolean} returns.isLargeDesktop - True when screen width is ≥ 1440px
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { isSmallMobile, isMobile, isTablet, isDesktop } = useResponsive();
 *
 *   return (
 *     <div>
 *       {isSmallMobile && <SmallMobileView />}
 *       {isMobile && !isSmallMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional styling based on screen size
 * function AdaptiveLayout() {
 *   const { isSmallMobile, isMobile, isTablet, isDesktop } = useResponsive();
 *
 *   const containerStyle = {
 *     padding: isSmallMobile ? '0.5rem' : isMobile ? '1rem' : '2rem',
 *     flexDirection: isMobile ? 'column' : 'row',
 *     gap: isDesktop ? '2rem' : '1rem'
 *   };
 *
 *   return <div style={containerStyle}>Content</div>;
 * }
 * ```
 *
 * @remarks
 * - Uses react-responsive library for efficient media query handling
 * - Breakpoints are defined centrally for consistency
 * - Values update automatically when window is resized
 * - Note: isTablet is now exclusive (769-1024px only)
 * - For mobile detection, use `isMobile` (includes small mobile)
 * - For small mobile only, use `isSmallMobile`
 */
export function useResponsive() {
  const isSmallMobile = useMediaQuery({ query: breakpoints.smallMobile });
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });
  const isLargeDesktop = useMediaQuery({ query: breakpoints.largeDesktop });

  return {
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}
