import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LoginModal } from '@/components/auth/LoginModal';
import {
  JetBrains_Mono,
  Nunito,
  Press_Start_2P,
  PT_Serif,
} from 'next/font/google';
import { cn } from '@/lib/utils';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans' });
const ptSerif = PT_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '700'],
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
const pressStart2p = Press_Start_2P({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'TLS Web',
  description: 'TLS Web Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        'font-sans',
        nunito.variable,
        ptSerif.variable,
        jetBrainsMono.variable,
        pressStart2p.variable
      )}
    >
      <body className="antialiased">
        <AuthProvider>
          {children}
          <LoginModal />
        </AuthProvider>
      </body>
    </html>
  );
}
