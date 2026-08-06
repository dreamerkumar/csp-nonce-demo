# Content Security Policy (CSP) with Nonce Demo

This repository demonstrates how to implement Content Security Policy (CSP) with nonces in a Next.js TypeScript application. It showcases how to allow specific inline scripts while blocking others, enhancing security in a modern React application.

## RuleCMS Engineering Blog

Read the companion article on the RuleCMS site: **[Content Security Policy Nonces in Next.js](https://rulecms.com/engineering/csp-nonce-in-nextjs)**.

## What is Content Security Policy?

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. CSP works by restricting the sources from which various content types can be loaded or executed.

## What is a Nonce?

A nonce ("number used once") is a random value generated for each request. When used with CSP, nonces allow specific inline scripts to be whitelisted, bypassing the default CSP restrictions. Without a nonce, CSP would block all inline scripts, requiring all JavaScript to be in external files. Nonces provide flexibility while maintaining security.

## Key Features

- **Dynamic Nonce Generation**: Cryptographically secure nonce generation for each request
- **Next.js Integration**: Custom `_document.tsx` and `_app.tsx` implementation for CSP headers
- **React Context API**: Properly passing the nonce to components using React Context
- **TypeScript Implementation**: Fully typed codebase for better safety
- **Real-time CSP Error Capture**: Custom console display showing CSP violations
- **Working & Broken Examples**: Demonstrates both allowed and blocked scripts

## Project Structure

### Core Components

- **`_document.tsx`**: Generates the nonce, sets the CSP header, and makes the nonce available to the client
- **`_app.tsx`**: Retrieves the nonce and provides it via a context
- **`contexts/NonceContext.tsx`**: React context for passing the nonce
- **`hooks/useNonce.tsx`**: Custom hook for easy access to the nonce

### Demo Pages

1. **Home (`/`)**: 
   - Overview of Content Security Policy and nonces
   - Links to all demo pages with explanations

2. **Working Inline Script (`/working-inline-script`)**: 
   - Demonstrates an inline script that executes because it has a valid nonce
   - Uses React's `useEffect` hook and the nonce context
   - Shows an alert after 5 seconds

3. **Broken Inline Script (`/broken-inline-script`)**: 
   - Demonstrates an inline script that is blocked by CSP
   - Uses a `securitypolicyviolation` event listener to capture CSP errors
   - Displays CSP violations in real-time on the page
   - Shows how scripts without proper nonces are blocked

4. **Inline Handler (`/inline-handler`)**: 
   - Demonstrates that inline event handlers in JSX are not affected by CSP restrictions
   - Shows how React's synthetic event system works with CSP

5. **Function Handler (`/function-handler`)**: 
   - Shows a function-based event handler in a React component
   - Demonstrates the recommended pattern for event handling in React

## Technical Implementation

### CSP Header

The Content Security Policy header is set in `_document.tsx` with the following directives:

```
default-src 'self';
script-src 'self' 'nonce-{dynamic-nonce}';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
block-all-mixed-content;
upgrade-insecure-requests;
```

The `script-src` directive specifically includes the dynamically generated nonce, which allows inline scripts with that nonce to execute.

### Nonce Generation

Nonces are generated using Node's crypto module:

```typescript
import crypto from 'crypto';

function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}
```

### Passing Nonce to Client

The nonce is made available to client-side code through:

1. A global variable set in `_document.tsx`:
   ```typescript
   <script
     dangerouslySetInnerHTML={{
       __html: `window.__NONCE__ = "${nonce}";`
     }}
     nonce={nonce}
   />
   ```

2. The React Context API in `_app.tsx`:
   ```typescript
   <NonceContext.Provider value={nonce}>
     <Component {...pageProps} />
   </NonceContext.Provider>
   ```

## Running Locally

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/csp-nonce-demo.git
   cd csp-nonce-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

For a production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Compatibility

This demo works with:
- Next.js 15.x
- React 19.x
- TypeScript 5.x
- Modern browsers with CSP support (Chrome, Firefox, Safari, Edge)

## Learn More

- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
