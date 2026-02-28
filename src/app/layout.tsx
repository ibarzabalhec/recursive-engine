import type { Metadata } from 'next';
import '@/styles/globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'The Recursive Engine',
  description: 'Type anything. See the geometry hidden inside it.',
  openGraph: {
    title: 'The Recursive Engine',
    description: 'What hides inside a word?',
    type: 'website',
    siteName: 'The Recursive Engine',
  },
  metadataBase: new URL('https://recursive-engine.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x25CB;</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
