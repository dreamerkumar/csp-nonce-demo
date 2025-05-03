import Layout from '../components/Layout';

export default function FunctionHandler() {
  // This is a separate function defined within the component
  function handleButtonClick(): void {
    alert("This alert comes from a function-based event handler in a React component!");
  }

  return (
    <Layout>
      <h1>Function-Based Event Handler</h1>

      <div className="card">
        <h2>What this page demonstrates</h2>
        <p>
          This page demonstrates a function-based event handler in a React component. Similar to the inline handler,
          this approach is also not affected by Content Security Policy restrictions, regardless of nonce settings.
        </p>
        <p>
          This illustrates that either approach - inline arrow functions or separate named functions - can be used
          with React's event handling system without worrying about CSP.
        </p>
      </div>

      <div className="card">
        <h2>Demo</h2>
        <p>Click the button below to trigger a function-based event handler:</p>
        <button 
          className="btn" 
          onClick={handleButtonClick}
        >
          Click me (Function Handler)
        </button>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p>
          The button above uses a named function defined within the component:
        </p>
        <div className="code-block">
          <pre>{`export default function FunctionHandler() {
  // This is a separate function defined within the component
  function handleButtonClick() {
    alert("This alert comes from a function-based event handler in a React component!");
  }

  return (
    <div>
      <button 
        className="btn" 
        onClick={handleButtonClick}
      >
        Click me (Function Handler)
      </button>
    </div>
  );
}`}</pre>
        </div>
        <p>
          This approach is often preferred for more complex event handlers or when the same handler needs
          to be reused in multiple places. It keeps the JSX cleaner and makes the component logic easier to follow.
        </p>
      </div>

      <div className="card">
        <h2>Comparison to inline handlers</h2>
        <p>Both approaches have their uses:</p>
        <ul style={{ marginLeft: '2rem' }}>
          <li><strong>Function-based handlers</strong> are better for complex logic, reuse, and testing</li>
          <li><strong>Inline handlers</strong> are convenient for simple, one-off actions</li>
        </ul>
        <p>
          The important thing to understand is that both approaches are compiled to regular JavaScript event listeners,
          so neither will be blocked by Content Security Policy restrictions. This is different from actual inline scripts
          (like the <code>&lt;script&gt;</code> tags on the other example pages), which do require nonces under a strict CSP.
        </p>
      </div>
    </Layout>
  );
}
