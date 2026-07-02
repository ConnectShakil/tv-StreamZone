import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://streamzone.app'),
  title: 'StreamZone — Free Live Sports Streaming',
  description: 'Watch live football, basketball, cricket, tennis and more for free. HD quality streams with multiple server options.',
  keywords: ['live sports streaming', 'free sports stream', 'watch football live', 'live cricket stream'],
  openGraph: {
    title: 'StreamZone — Free Live Sports Streaming',
    description: 'Watch live football, basketball, cricket, tennis and more for free.',
    images: [
      {
        url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0F172A]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
