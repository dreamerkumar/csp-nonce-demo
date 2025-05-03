import type { AppProps } from 'next/app';
import NonceContext from '../contexts/NonceContext';
import '../styles/globals.css';
import { NextPageContext } from 'next';

interface MyAppProps extends AppProps {
  nonce: string;
}

function MyApp({ Component, pageProps, nonce }: MyAppProps) {
  return (
    <NonceContext.Provider value={nonce}>
      <Component {...pageProps} />
    </NonceContext.Provider>
  );
}

// Using getInitialProps to ensure we get the same nonce on client and server
MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  // In the browser, get nonce from window.__NONCE__
  let nonce = '';
  if (typeof window !== 'undefined') {
    nonce = (window as any).__NONCE__ || '';
  } 
  // In SSR, nonce will be passed to us from _document.tsx
  else if (ctx.res && (ctx.res as any).locals && (ctx.res as any).locals.nonce) {
    nonce = (ctx.res as any).locals.nonce;
  }

  return { 
    pageProps: {},
    nonce 
  };
};

export default MyApp;
