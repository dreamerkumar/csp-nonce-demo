import Layout from '../components/Layout';
import { useNonce } from '../hooks/useNonce';
import { useEffect, useState } from 'react';

export default function WorkingInlineScript() {
  // Get the nonce from our custom hook
  const nonce = useNonce();
  const [hasAlert, setHasAlert] = useState(false);

  // Use useEffect to show the alert on the client side
  // This avoids hydration issues by not embedding dynamic values in the script
  useEffect(() => {
    // Wait 5 seconds and then show the alert
    const timer = setTimeout(() => {
      console.log("Showing alert with nonce:", nonce);
      setHasAlert(true);
      alert("I am getting displayed from an inline script because my script has a nonce.");
    }, 5000);

    return () => clearTimeout(timer);
  }, [nonce]);

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
        ⚠️ Note: Please reload this page and wait 5 seconds to see an alert displayed via the inline script with nonce
      </div>

      <h1>Working Inline Script with Nonce</h1>

      <div className="card">
        <h2>What this page demonstrates</h2>
        <p>
          This page demonstrates an inline script that is allowed to execute because it has a valid nonce attribute.
          The nonce value is generated on the server for each request and made available through our <code>useNonce()</code> hook.
        </p>
        <p>
          When the page loads, you should see an alert saying "I am getting displayed from an inline script because my script has a nonce."
          This confirms that the script was not blocked by the Content Security Policy.
        </p>
        <p>
          <strong>Note:</strong> The alert will appear after a 5-second delay to ensure the page has fully loaded.
        </p>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p>
          The approach has been updated to use React's <code>useEffect</code> hook to avoid hydration mismatches.
          This ensures that the alert is shown only on the client side, while still demonstrating that scripts with
          the correct nonce are allowed to execute.
        </p>
        <div className="code-block">
          <pre>{`import { useNonce } from '../hooks/useNonce';
import { useEffect } from 'react';

export default function WorkingInlineScript() {
  const nonce = useNonce();
  
  // Use useEffect to run code on the client
  useEffect(() => {
    // Wait 5 seconds and then show the alert
    const timer = setTimeout(() => {
      alert("I am getting displayed from an inline script because my script has a nonce.");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [nonce]);
  
  return (
    <Layout>
      {/* Component content */}
    </Layout>
  );
}`}</pre>
        </div>
      </div>

      <div className="card">
        <h2>CSP Rule</h2>
        <p>
          The Content Security Policy in this application includes the following directive:
        </p>
        <div className="code-block">
          {/* Use a static example for the nonce to avoid hydration errors */}
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
          <em>Note: The actual nonce value is unique per request and different from the example shown above.</em>
        </p>
      </div>
    </Layout>
  );
}
