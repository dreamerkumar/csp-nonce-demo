import Layout from '../components/Layout';

export default function InlineHandler() {
  return (
    <Layout>
      <h1>Inline Event Handler in JSX</h1>

      <div className="card">
        <h2>What this page demonstrates</h2>
        <p>
          This page demonstrates that inline event handlers in JSX are not affected by Content Security Policy restrictions.
          Even though our CSP is strict about inline scripts, JSX event handlers work perfectly fine without a nonce.
        </p>
        <p>
          This is because React's JSX is transformed into regular JavaScript function calls during compilation.
          Event handlers are not actually inserted as inline scripts in the final HTML.
        </p>
      </div>

      <div className="card">
        <h2>Demo</h2>
        <p>Click the button below to trigger an inline event handler:</p>
        <button 
          className="btn" 
          onClick={() => alert("This alert comes from an inline event handler in JSX!")}
        >
          Click me (Inline Handler)
        </button>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p>
          The button above uses an inline arrow function directly in the <code>onClick</code> attribute:
        </p>
        <div className="code-block">
          <pre>{`<button 
  className="btn" 
  onClick={() => alert("This alert comes from an inline event handler in JSX!")}
>
  Click me (Inline Handler)
</button>`}</pre>
        </div>
        <p>
          When React processes this JSX, it doesn't create an inline <code>onclick</code> attribute in the HTML.
          Instead, it attaches an event listener through JavaScript. The compiled output might look something like:
        </p>
        <div className="code-block">
          <pre>{`// Simplified example of what React does
const button = document.createElement('button');
button.addEventListener('click', () => {
  alert("This alert comes from an inline event handler in JSX!");
});`}</pre>
        </div>
        <p>
          Since this is done through JavaScript's event handling system rather than inline HTML attributes, 
          it doesn't violate the Content Security Policy, even without a nonce.
        </p>
      </div>

      <div className="card">
        <h2>Why this matters</h2>
        <p>
          This behavior is important because it means you can use React's event handling system normally, 
          even with a strict CSP that blocks inline scripts. You don't need to apply nonces to your JSX event handlers
          or move all event handlers to separate functions.
        </p>
        <p>
          This makes React applications more secure against XSS attacks while maintaining developer convenience.
        </p>
      </div>
    </Layout>
  );
}
