'use client';

export const dynamic = 'force-dynamic';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#2D7BA8' }}>
          Oops!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Something went wrong
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-lg font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
