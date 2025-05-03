import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <h1>Content Security Policy (CSP) with Nonce in Next.js</h1>
      
      <div className="card">
        <h2>What is Content Security Policy?</h2>
        <p>
          Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks,
          including Cross-Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft,
          to site defacement, to malware distribution.
        </p>
      </div>

      <div className="card">
        <h2>What is a Nonce?</h2>
        <p>
          A nonce ("number used once") is a random value generated for each request.
          When used with CSP, nonces allow specific inline scripts to be whitelisted, bypassing the default CSP restrictions.
        </p>
        <p>
          Without a nonce, CSP would block all inline scripts, requiring all JavaScript to be in external files.
          Nonces provide flexibility while maintaining security.
        </p>
      </div>

      <div className="card">
        <h2>Demonstration Pages</h2>
        <p>This demo contains the following pages to demonstrate CSP and nonces in action:</p>
        <ul style={{ marginLeft: '2rem' }}>
          <li>
            <Link href="/working-inline-script">Working Inline Script</Link> - Shows a React component that uses the nonce to safely execute code
          </li>
          <li>
            <Link href="/broken-inline-script">Broken Inline Script</Link> - Shows how scripts without a proper nonce are blocked by CSP
          </li>
          <li>
            <Link href="/inline-handler">Inline Handler</Link> - Demonstrates that inline event handlers in JSX are not affected by CSP restrictions
          </li>
          <li>
            <Link href="/function-handler">Function Handler</Link> - Shows a function-based event handler in a React component
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <p>This application implements CSP with nonces using the following components:</p>
        <ol style={{ marginLeft: '2rem' }}>
          <li>A custom <code>_document.tsx</code> that generates a nonce for each request and sets CSP headers</li>
          <li>A <code>NonceContext</code> that passes the nonce to all components</li>
          <li>A <code>useNonce()</code> hook that makes it easy to access the nonce from any component</li>
        </ol>
        <p>
          In our React-first implementation, we use the nonce in two ways:
        </p>
        <ol style={{ marginLeft: '2rem' }}>
          <li>Directly applying it to script tags (with the nonce attribute) when needed</li>
          <li>Using React's <code>useEffect</code> hook for client-side code execution</li>
        </ol>
        <div className="code-block">
          <pre>{`// Modern React-first approach with useNonce and useEffect:
import { useNonce } from '../hooks/useNonce';
import { useEffect } from 'react';

function MyComponent() {
  const nonce = useNonce();
  
  // For client-side operations
  useEffect(() => {
    // Safe client-side code execution
    // This avoids hydration mismatches while still
    // demonstrating CSP with nonces
    console.log("Nonce value:", nonce);
    
    // For actual inline scripts that need the nonce:
    const script = document.createElement('script');
    script.nonce = nonce || '';
    script.textContent = 'console.log("Script with nonce executes successfully")';
    document.body.appendChild(script);
    
    return () => {
      // Clean up if needed
      document.body.removeChild(script);
    };
  }, [nonce]);
  
  return (
    <div>
      {/* Your component content */}
    </div>
  );
}`}</pre>
        </div>
      </div>
    </Layout>
  );
}
