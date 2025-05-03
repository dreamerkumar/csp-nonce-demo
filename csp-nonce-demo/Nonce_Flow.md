# Nonce Flow from Next.js Backend to Each Client Page

This document explains the complete flow of a Content Security Policy (CSP) nonce from generation on the server to usage in client-side components. Understanding this flow is crucial for implementing secure CSP with nonces in Next.js applications.

## 1. Nonce Generation in `_document.tsx`

The nonce lifecycle begins in the custom `_document.tsx` file, which is responsible for server-side rendering of the HTML skeleton. Here, we generate a cryptographically secure random nonce for each request using Node.js's built-in `crypto` module.

```typescript
// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import Document, { DocumentContext, DocumentInitialProps } from 'next/document';
import crypto from 'crypto';

// Generate a random nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

interface MyDocumentProps extends DocumentInitialProps {
  nonce: string;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    // Generate a unique nonce for this request
    const nonce = generateNonce();
    
    // ... additional code ...
    
    return { ...originalProps, nonce };
  }
  
  // ... render method ...
}
```

## 2. Server-Side Storage

After generating the nonce, it needs to be accessible to other server components. We store it in two places:

1. In the document props (which get passed to the render method)
2. In the response locals object, which is available throughout the request lifecycle

```typescript
// src/pages/_document.tsx (continued)
static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
  // Generate a unique nonce for this request
  const nonce = generateNonce();
  
  // Store nonce in response locals to be used by _app.tsx
  if (ctx.res && (ctx.res as any).locals) {
    (ctx.res as any).locals.nonce = nonce;
  } else if (ctx.res) {
    (ctx.res as any).locals = { nonce };
  }
  
  // Get the original props
  const originalProps = await Document.getInitialProps(ctx);
  
  // Return props with the nonce
  return { ...originalProps, nonce };
}
```

## 3. Setting CSP Headers

With the nonce generated, we use it to create a Content Security Policy header that includes the nonce. This header is included in the HTML document's `<head>` section.

```typescript
// src/pages/_document.tsx (render method)
render() {
  const { nonce } = this.props;
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Define Content Security Policy with the nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  return (
    <Html>
      <Head nonce={nonce}>
        <meta httpEquiv="Content-Security-Policy" content={cspHeader} />
        {/* Additional head content */}
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce} />
        {/* Additional body content */}
      </body>
    </Html>
  );
}
```

## 4. Passing Nonce to Client-Side JavaScript

To make the nonce available to client-side code, we inject it as a global variable using a small inline script. This script itself must include the nonce attribute to be allowed to execute.

```typescript
// src/pages/_document.tsx (continued)
return (
  <Html>
    <Head nonce={nonce}>
      {/* Head content */}
    </Head>
    <body>
      <Main />
      <NextScript nonce={nonce} />
      {/* Store nonce in a global variable for client-side access */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__NONCE__ = "${nonce}";
          `,
        }}
        nonce={nonce}
      />
    </body>
  </Html>
);
```

## 5. Retrieving Nonce in `_app.tsx` and Setting Up Context Provider

The application component (`_app.tsx`) is responsible for initializing pages and setting up the React context providers that will be available to all components. 

This component:
1. Uses `getInitialProps` to retrieve the nonce from different sources depending on the rendering environment
2. Receives the nonce as a prop from Next.js
3. Passes this nonce value to the NonceContext.Provider, making it available to all child components

Here's the complete flow:

```typescript
// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import type { NextPageContext } from 'next/types';
import { NonceContext } from '../contexts/NonceContext';
import '../styles/globals.css';

// Extend the standard AppProps type to include our nonce
interface MyAppProps extends AppProps {
  nonce: string;
}

function MyApp({ Component, pageProps, nonce }: MyAppProps) {
  // The nonce is provided as a prop to MyApp from getInitialProps
  // We then wrap the entire application with NonceContext.Provider
  // This makes the nonce available to all components through useContext
  return (
    <NonceContext.Provider value={nonce}>
      <Component {...pageProps} />
    </NonceContext.Provider>
  );
}

// This method runs:
// - On the server for the initial page load
// - On the client for page transitions
MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  // In the browser, get nonce from window.__NONCE__
  let nonce = '';
  if (typeof window !== 'undefined') {
    // Client-side: retrieve nonce from the global variable
    // that was set by our script in _document.tsx
    nonce = (window as any).__NONCE__ || '';
    console.log("Client-side nonce retrieval:", nonce);
  } 
  // In SSR, nonce will be passed from _document.tsx via res.locals
  else if (ctx.res && (ctx.res as any).locals && (ctx.res as any).locals.nonce) {
    // Server-side: retrieve nonce from res.locals
    // which was set in _document.tsx's getInitialProps
    nonce = (ctx.res as any).locals.nonce;
    console.log("Server-side nonce retrieval:", nonce);
  }

  // Return nonce as part of the props that will be passed to MyApp
  return { 
    pageProps: {},
    nonce 
  };
};

export default MyApp;
```

This system ensures that:
1. During server-side rendering, the nonce is passed from `_document.tsx` to `_app.tsx` through `res.locals`
2. During client-side navigation, the nonce is retrieved from the global `window.__NONCE__` variable
3. The nonce is then consistently provided to all components through React's context system

The key insight is that Next.js automatically passes the result of `getInitialProps` as props to the `MyApp` component, which allows us to receive the nonce value and provide it through our context.

## 6. Creating a React Context for the Nonce

To make the nonce easily accessible throughout the component tree, we create a dedicated React context:

```typescript
// src/contexts/NonceContext.tsx
import { createContext, useContext } from 'react';

// Create a context with a default empty string
export const NonceContext = createContext<string>('');

// Optional: Create a provider component if needed
export const NonceProvider = NonceContext.Provider;
```

## 7. Creating a Custom Hook for Easy Access

To simplify access to the nonce from any component, we create a custom hook:

```typescript
// src/hooks/useNonce.tsx
import { useContext } from 'react';
import { NonceContext } from '../contexts/NonceContext';

export function useNonce(): string {
  return useContext(NonceContext);
}
```

## 8. Using the Nonce in Components

Now, components can easily access the nonce using the custom hook:

### Method 1: Using the nonce with a script tag (React-way)

```typescript
// In any component
import { useNonce } from '../hooks/useNonce';
import { useEffect } from 'react';

function MyComponent() {
  const nonce = useNonce();
  
  useEffect(() => {
    // Create a script element with the nonce
    const script = document.createElement('script');
    script.nonce = nonce || '';  // Fallback to empty string if nonce is null
    script.textContent = `
      console.log("This script will execute because it has the proper nonce");
      // Your script code here
    `;
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, [nonce]);
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### Method 2: Direct use in JSX with inline script

```typescript
// In any component
import { useNonce } from '../hooks/useNonce';

function MyComponent() {
  const nonce = useNonce();
  
  return (
    <div>
      {/* Inline script with nonce */}
      <script
        nonce={nonce || undefined} // undefined removes the attribute if nonce is empty
        dangerouslySetInnerHTML={{
          __html: `
            console.log("This script will execute because it has the proper nonce");
            // Your script code here
          `
        }}
      />
      {/* Other component content */}
    </div>
  );
}
```

## 9. Complete Nonce Flow Diagram

```
Server Request
    │
    ▼
Generate Nonce (crypto.randomBytes)
    │
    ▼
Store in res.locals and document props
    │
    ▼
Set CSP Header with nonce
    │
    ▼
Render HTML with <script nonce={nonce}>
    │
    ▼
Client Receives HTML
    │
    ▼
window.__NONCE__ is set
    │
    ▼
_app.tsx retrieves nonce
    │
    ▼
NonceContext.Provider makes nonce available
    │
    ▼
Components use useNonce() hook
    │
    ▼
Scripts with matching nonce are allowed to execute
```

## 10. Troubleshooting Common Issues

1. **Hydration Errors**: If you see React hydration mismatches, ensure you're not including dynamic values directly in the script content. Use React's `useEffect` hook to run scripts after hydration.

2. **CSP Violations**: If scripts are still being blocked, check browser console for CSP errors. The CSP header may not be correctly formatted or the nonce may not be properly passed.

3. **Missing Nonce**: If `useNonce()` returns an empty string, verify the flow from `_document.tsx` to `_app.tsx` to ensure the nonce is being properly stored and retrieved.

## Summary

This flow ensures that a unique, cryptographically secure nonce is generated for each request and properly passed from the server to the client components. By following this pattern, you can implement a strict Content Security Policy that blocks unauthorized inline scripts while allowing specific trusted scripts to execute.

The React context system makes this implementation clean and maintainable, following best practices for state management in React applications.
