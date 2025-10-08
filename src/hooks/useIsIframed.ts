import { useState, useEffect } from "react";

export const useIsIframed = (): boolean => {
  const [isIframed, setIsIframed] = useState<boolean>(false);

  useEffect(() => {
    // Check if the current window is inside an iframe
    const checkIsIframed = () => {
      try {
        return window.self !== window.top;
      } catch {
        // If we can't access window.top due to cross-origin restrictions,
        // we're likely in an iframe
        return true;
      }
    };

    setIsIframed(checkIsIframed());
  }, []);

  return isIframed;
};
