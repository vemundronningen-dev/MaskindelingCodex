import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maskindeling.no',
  description: 'Internt system for deling av maskiner i kommunen'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
