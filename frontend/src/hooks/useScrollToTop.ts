import { useEffect, useLayoutEffect } from 'react';

/**
 * Custom hook that scrolls to the top of the page when the component mounts
 * This ensures consistent behavior across all pages when navigating
 */
export const useScrollToTop = () => {
  // Use useLayoutEffect for immediate execution before browser paint
  useLayoutEffect(() => {
    console.log('useScrollToTop: useLayoutEffect - immediate scroll attempt');
    
    // Immediate scroll attempt
    try {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch (error) {
      console.warn('Immediate scroll failed:', error);
    }
  }, []);

  useEffect(() => {
    console.log('useScrollToTop: useEffect - delayed scroll attempts');
    console.log('Current scroll position:', window.scrollY);
    
    // Use requestAnimationFrame to ensure DOM is ready
    const scrollToTop = () => {
      console.log('useScrollToTop: Executing scroll to top');
      
      // Store original scroll behavior
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      
      try {
        // Temporarily disable smooth scrolling for immediate effect
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Try multiple scroll methods for better browser compatibility
        // Method 1: Standard scrollTo
        window.scrollTo(0, 0);
        console.log('useScrollToTop: Method 1 executed');
        
        // Method 2: Document element scroll (for older browsers)
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
          console.log('useScrollToTop: Method 2 executed');
        }
        
        // Method 3: Body scroll (for older browsers)
        if (document.body) {
          document.body.scrollTop = 0;
          console.log('useScrollToTop: Method 3 executed');
        }
        
        // Method 4: Window scroll with explicit coordinates
        if (window.scrollY > 0) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
          console.log('useScrollToTop: Method 4 executed');
        }
        
        // Verify scroll position
        setTimeout(() => {
          console.log('useScrollToTop: Final scroll position:', window.scrollY);
          
          // If still not at top, try again
          if (window.scrollY > 0) {
            console.log('useScrollToTop: Retrying scroll to top');
            window.scrollTo(0, 0);
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
          }
        }, 100);
        
      } catch (error) {
        console.warn('Scroll to top failed:', error);
      } finally {
        // Restore original scroll behavior after a short delay
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = originalScrollBehavior;
        }, 100);
      }
    };

    // Multiple attempts to ensure scroll happens
    const attempt1 = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 50);
    
    const attempt2 = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 150);
    
    const attempt3 = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 300);

    return () => {
      clearTimeout(attempt1);
      clearTimeout(attempt2);
      clearTimeout(attempt3);
    };
  }, []);
};
