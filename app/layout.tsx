import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Documentation | Your Project Name",
  description: "Project documentation site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-transition" suppressHydrationWarning>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply theme before React hydrates to prevent flash
                  var storedPreference = localStorage.getItem('darkMode');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var darkModeEnabled = storedPreference === 'true' || 
                    (storedPreference === null && prefersDark);
                  
                  if (darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.log('Error applying initial theme', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-yeezy">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
