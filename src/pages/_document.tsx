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
          <link 
            rel="icon" 
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>"
            type="image/svg+xml"
          />
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
  }
}

export default MyDocument;
