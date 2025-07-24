/**
 * This module defines the root layout for the Next.js application,
 * including imports, metadata, font setup, and the main layout component.
 */

/**
 * Import React type for type checking in components.
 */
import type React from "react";

/**
 * Import Metadata type from Next.js for defining page metadata.
 */
import type { Metadata } from "next";

/**
 * Import the Inter font from Next.js Google Fonts.
 */
import { Inter } from "next/font/google";

/**
 * Import the global CSS styles.
 */
import "./globals.css";

/**
 * Import the ThemeProvider component for theme management.
 */
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Import the Navbar component for the application header.
 */
import { Navbar } from "@/components/Navbar";

/**
 * Initialize the Inter font with specified subsets.
 */
const interFont = Inter({ subsets: ["latin"] });

/**
 * Define the metadata for the application.
 */
export const metadata: Metadata = {
  title: "Invoice Management App",
  description: "Modern invoice management application",
  generator: "v0.dev",
};

/**
 * RootLayout component that sets up the basic HTML structure for the application.
 * It includes the font, theme provider, and navbar.
 *
 * @param {Object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to render.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set up the HTML structure with the selected font
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={interFont.className}>
        {/* Apply the theme provider with specified configurations */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Include the navbar component */}
          <Navbar />
          {/* Render the child components */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}