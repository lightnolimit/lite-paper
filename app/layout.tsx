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
                  // Initial theme application (will be replaced by React after hydration)
                  var darkModeEnabled = localStorage.getItem('darkMode') === 'true';
                  if (darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.log('Error accessing localStorage', e);
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
