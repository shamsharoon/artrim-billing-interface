/**
 * Module for providing theme management in a Next.js application.
 */

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * A wrapper component that provides theme management using NextThemesProvider.
 * @param {ThemeProviderProps} props - The props including children and other theme options.
 * @returns {JSX.Element} The NextThemesProvider component with props and children.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}