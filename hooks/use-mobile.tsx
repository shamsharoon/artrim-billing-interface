/**
 * This module provides a custom React hook to detect if the current viewport is mobile based on a predefined breakpoint.
 */

import * as React from "react"

// Define the mobile breakpoint in pixels
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to determine if the current viewport is considered mobile.
 * 
 * This hook monitors the window width and returns true if it is less than the defined mobile breakpoint.
 * 
 * Edge cases:
 * - On initial render, the state is set based on the current window.innerWidth.
 * - If the window width is exactly 768px, it returns false as it checks for less than the breakpoint.
 * - This hook requires a browser environment; it will not work in server-side rendering scenarios.
 * 
 * @returns {boolean} True if the viewport width is less than 768px, otherwise false.
 */
export function useIsMobile(): boolean {
  // State to hold whether the device is mobile
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list for the mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler function to update the state on window resize
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for changes
    mql.addEventListener("change", onChange)
    
    // Set initial state based on current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup function to remove event listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile  // Ensure the value is explicitly converted to a boolean
}