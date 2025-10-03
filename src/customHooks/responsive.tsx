import { useMediaQuery } from "react-responsive";

// Define your breakpoints in a central place
const breakpoints = {
  mobile: "(max-width: 768px)",
  tablet: "(max-width: 1024px)",
  desktop: "(min-width: 1025px)",
};

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
