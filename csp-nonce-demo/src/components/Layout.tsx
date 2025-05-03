import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/working-inline-script">Working Inline Script</Link>
          </li>
          <li>
            <Link href="/broken-inline-script">Broken Inline Script</Link>
          </li>
          <li>
            <Link href="/inline-handler">Inline Handler</Link>
          </li>
          <li>
            <Link href="/function-handler">Function Handler</Link>
          </li>
        </ul>
      </nav>
      <main className="container">
        {children}
      </main>
      <footer className="container">
        <p>© {new Date().getFullYear()} CSP Nonce Demo - A Next.js tutorial application</p>
      </footer>
    </>
  );
}
