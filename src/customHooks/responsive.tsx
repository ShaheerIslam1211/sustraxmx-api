import { useMediaQuery } from "react-responsive";

/**
 * Centralized breakpoint definitions for consistent responsive design
 *
 * @remarks
 * These breakpoints follow a mobile-first approach:
 * - Mobile: 0-768px
 * - Tablet: 769-1024px
 * - Desktop: 1025px+
 */
const breakpoints = {
  mobile: "(max-width: 768px)",
  tablet: "(max-width: 1024px)",
  desktop: "(min-width: 1025px)",
};

/**
 * Custom hook for responsive design breakpoint detection
 *
 * This hook provides a clean interface for detecting different screen sizes
 * using CSS media queries. It returns boolean values for each breakpoint.
 *
 * @returns {Object} An object containing boolean values for each breakpoint
 * @returns {boolean} returns.isMobile - True when screen width is ≤ 768px
 * @returns {boolean} returns.isTablet - True when screen width is ≤ 1024px
 * @returns {boolean} returns.isDesktop - True when screen width is ≥ 1025px
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && !isMobile && <TabletView />}
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
 *   const { isMobile, isDesktop } = useResponsive();
 *
 *   const containerStyle = {
 *     padding: isMobile ? '1rem' : '2rem',
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
 * - Note: isTablet will be true for both tablet and mobile sizes
 * - For exclusive tablet detection, use `isTablet && !isMobile`
 */
export function useResponsive() {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}
