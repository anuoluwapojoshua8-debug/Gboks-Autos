"use client";

import { ThemeProvider } from "next-themes";

// Wraps the app so light/dark mode works with class strategy + no flash.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
