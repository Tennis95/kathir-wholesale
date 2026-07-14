'use client';

export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f9fe', padding: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#2d7ba8' }}>
              Oops!
            </h1>
            <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '24px' }}>
              Something went wrong
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #2d7ba8 0%, #1e5a7a 100%)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
