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
    <html lang="en" className="theme-transition">
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkModeEnabled = localStorage.getItem('darkMode') === 'true';
                  if (darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    if (localStorage.getItem('darkMode') === null) {
                      localStorage.setItem('darkMode', 'false');
                    }
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
        {children}
      </body>
    </html>
  );
}
