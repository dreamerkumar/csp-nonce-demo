import Layout from '../components/Layout';
import { useNonce } from '../hooks/useNonce';
import { useEffect, useRef, useState } from 'react';

export default function BrokenInlineScript() {
  const nonce = useNonce();
  const consoleRef = useRef<HTMLDivElement>(null);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);
  const [cspError, setCspError] = useState<string>('');

  useEffect(() => {
    // Override console methods at component mount time
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Function to add message to our state
    const addMessage = (type: string, ...args: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setConsoleMessages(prev => [...prev, `[${timestamp}] [${type}] ${message}`]);
    };

    // Override console methods
    console.log = (...args) => {
      originalConsoleLog(...args);
      addMessage('log', ...args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addMessage('error', ...args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addMessage('warn', ...args);
    };

    console.info = (...args) => {
      originalConsoleInfo(...args);
      addMessage('info', ...args);
    };

    // Set up event listener for CSP violations
    const handleSecurityPolicyViolation = (e: SecurityPolicyViolationEvent) => {
      const timestamp = new Date().toLocaleTimeString();
      const violationMessage = `
CSP Violation:
- Directive: ${e.violatedDirective}
- Blocked URI: ${e.blockedURI}
- Source: ${e.sourceFile}:${e.lineNumber}:${e.columnNumber}
- Policy: ${e.originalPolicy.substring(0, 100)}...
      `;
      
      setCspError(violationMessage);
      addMessage('csp-violation', violationMessage);
    };

    // Add event listener for CSP violations
    document.addEventListener('securitypolicyviolation', handleSecurityPolicyViolation);

    // Add another script tag with setTimeout to ensure it happens after the event listener is set up
    setTimeout(() => {
      // This effect adds a broken script element without a nonce
      // This will be blocked by CSP and trigger our event listener
      const script = document.createElement('script');
      script.textContent = `
        console.log("This script should be blocked by CSP");
        alert("This alert will not appear because the script doesn't have a nonce.");
      `;
      document.body.appendChild(script);
      
      // Log a message to our custom console
      console.log("Attempted to add script without nonce - it should be blocked by CSP");
    }, 100);

    // Clean up on unmount
    return () => {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      
      // Remove event listener
      document.removeEventListener('securitypolicyviolation', handleSecurityPolicyViolation);
    };
  }, []);

  return (
    <Layout>
      <div style={{ 
        backgroundColor: '#fff3cd', 
        color: '#856404', 
        padding: '12px 20px', 
        margin: '20px 0', 
        borderRadius: '4px', 
        borderLeft: '5px solid #ffeeba',
        fontWeight: 'bold'
      }}>
        ⚠️ Note: Please reload this page to see CSP blocking an inline script without a nonce
      </div>
      
      <h1>Broken Inline Script without Nonce</h1>

      <div className="card">
        <h2>What this page demonstrates</h2>
        <p>
          This page demonstrates an inline script that is <strong>blocked</strong> by the Content Security Policy
          because it does not have a valid nonce attribute.
        </p>
        <p>
          When the page loads, a script without a nonce is injected into the page. You should <strong>not</strong> see an alert,
          and you should see a CSP violation error in the console below and in your browser's developer tools.
        </p>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p>
          We intentionally add a script element without a nonce to the document. Because our CSP is configured
          to only allow inline scripts with a valid nonce, this script will be blocked by the browser.
        </p>
        <div className="code-block">
          <pre>{`// Set up event listener for CSP violations
const handleSecurityPolicyViolation = (e) => {
  console.log("CSP Violation:", e.violatedDirective);
};

// Add event listener for CSP violations
document.addEventListener('securitypolicyviolation', handleSecurityPolicyViolation);

// Add script without nonce
const script = document.createElement('script');
script.textContent = \`
  console.log("This script should be blocked by CSP");
  alert("This alert will not appear because the script doesn't have a nonce.");
\`;
document.body.appendChild(script);`}</pre>
        </div>
      </div>

      <div className="card">
        <h2>CSP Rule</h2>
        <p>
          The Content Security Policy in this application includes the following directive:
        </p>
        <div className="code-block">
          {/* Use a static example to avoid hydration errors */}
          <pre>{`script-src 'self' 'nonce-EXAMPLE_NONCE_VALUE';`}</pre>
        </div>
        <p>
          This means that scripts are only allowed from:
        </p>
        <ul style={{ marginLeft: '2rem' }}>
          <li><code>'self'</code> - Scripts loaded from the same origin</li>
          <li><code>'nonce-${'{dynamic-nonce-value}'}'</code> - Inline scripts with the correct nonce attribute</li>
        </ul>
        <p>
          Any inline script without a nonce, like the one on this page, will be blocked.
        </p>
      </div>

      <div className="card">
        <h2>CSP Violation</h2>
        <p>
          Below is the CSP violation error from your browser:
        </p>
        <div style={{ 
          backgroundColor: '#fee',
          color: '#c00', 
          padding: '15px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {cspError || <em>Waiting for CSP violation...</em>}
        </div>
      </div>

      <div className="card">
        <h2>Console Output</h2>
        <p>
          This is a live display of console messages from your browser. CSP violations will appear here:
        </p>
        <div 
          ref={consoleRef} 
          style={{ 
            backgroundColor: '#1e1e1e', 
            color: '#d4d4d4', 
            padding: '15px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '10px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {consoleMessages.length === 0 ? (
            <p style={{ color: '#888', margin: '0' }}>Waiting for console messages...</p>
          ) : (
            consoleMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '5px' }}>{msg}</div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
