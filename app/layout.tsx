import type { Metadata } from "next";
import "./globals.css";

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
                  // Function to apply theme (used both initially and during navigation)
                  function applyTheme() {
                    var darkModeEnabled = localStorage.getItem('darkMode') === 'true';
                    if (darkModeEnabled) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                      if (localStorage.getItem('darkMode') === null) {
                        localStorage.setItem('darkMode', 'false');
                      }
                    }
                  }
                  
                  // Apply theme immediately
                  applyTheme();
                  
                  // Create observer to watch for SPA navigation
                  var observer = new MutationObserver(function(mutations) {
                    applyTheme();
                  });
                  
                  // Start observing when DOM is loaded
                  document.addEventListener('DOMContentLoaded', function() {
                    observer.observe(document.body, {
                      childList: true,
                      subtree: true
                    });
                  });
                  
                  // Listen for theme changes from ThemeSwitcher component
                  window.addEventListener('themeChange', applyTheme);
                  
                  // Apply theme on page load and navigation
                  window.addEventListener('load', applyTheme);
                  document.addEventListener('visibilitychange', applyTheme);
                } catch (e) {
                  console.log('Error accessing localStorage', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-yeezy">
        {children}
      </body>
    </html>
  );
}
