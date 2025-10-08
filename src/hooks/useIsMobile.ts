import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is mobile
 * 
 * This hook combines user agent detection with screen width analysis to determine
 * if the user is on a mobile device. It automatically updates when the window is resized.
 * 
 * @returns {boolean} True if the device is mobile or screen width is <= 768px
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Uses a combination of user agent detection and screen width
 * - Automatically updates on window resize
 * - Mobile breakpoint is set at 768px
 * - Includes cleanup for resize event listener
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Checks if the current device/viewport should be considered mobile
     * Uses both user agent detection and screen width analysis
     */
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check for mobile devices using user agent
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      
      // Also check screen width (mobile-first breakpoint)
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener for responsive behavior
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

/**
 * Simple synchronous function to check if the current device is mobile
 * 
 * This is a utility function that provides immediate mobile detection without
 * the reactive behavior of the hook. Useful for one-time checks or server-side rendering.
 * 
 * @returns {boolean} True if the device is mobile or screen width is <= 768px
 * 
 * @example
 * ```tsx
 * // One-time check
 * if (isMobile()) {
 *   console.log('User is on mobile');
 * }
 * 
 * // In a utility function
 * const getLayoutConfig = () => {
 *   return isMobile() ? mobileConfig : desktopConfig;
 * };
 * ```
 * 
 * @remarks
 * - Returns false if window is undefined (SSR safe)
 * - Does not update automatically on resize
 * - Use the hook version for reactive components
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileDevice || isSmallScreen;
};