import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mateo Padilla Peña | Full Stack Developer & Backend Specialist",
  description:
    "Portfolio de Mateo Padilla Peña, Desarrollador Full Stack con especialización en arquitecturas backend escalables (NestJS, TypeScript, Python, Vue.js, Firebase, BigQuery). Disponible para proyectos remotos.",
  keywords: [
    "Mateo Padilla Peña",
    "Desarrollador Full Stack",
    "Backend Developer",
    "NestJS",
    "TypeScript",
    "Python",
    "Vue.js",
    "Firebase",
    "BigQuery",
    "Medellín",
    "Colombia",
    "Software Engineer",
  ],
  authors: [{ name: "Mateo Padilla Peña" }],
  creator: "Mateo Padilla Peña",
  publisher: "Mateo Padilla Peña",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png?v=5",
    shortcut: "/favicon.ico?v=5",
    apple: "/favicon.png?v=5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=5" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('portfolio-theme');
                  const isDark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  const meta = document.querySelector('meta[name="color-scheme"]');
                  if (meta) {
                    meta.content = stored === 'light' || stored === 'dark' ? stored : 'light dark';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-200`}
      >
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
