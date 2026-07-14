'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body suppressHydrationWarning>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 p-6">
          <div className="text-center">
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#2D7BA8' }}>
              Oops!
            </h1>
            <p style={{ fontSize: '20px', color: '#4B5563', marginBottom: '24px' }}>
              Something went wrong
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                border: 'none',
                cursor: 'pointer',
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
