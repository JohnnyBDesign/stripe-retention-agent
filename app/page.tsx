import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Stripe Retention Agent</h1>
        <p className="text-lg text-gray-600 mb-8">
          Agent-native retention product that classifies churn and enrolls customers in recovery sequences.
        </p>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Stripe webhook ingestion with idempotency</li>
              <li>Heuristic churn classification (7 reason types)</li>
              <li>Human-in-the-loop approval queue</li>
              <li>Automatic Resend enrollment via tags</li>
              <li>Silent rescue & never-activated detection</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/queue"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open Queue →
            </Link>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Quick Start</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Copy .env.example to .env and add your API keys</li>
              <li>Run database migrations: <code className="bg-gray-100 px-1">npm run db:push</code></li>
              <li>Start the dev server: <code className="bg-gray-100 px-1">npm run dev</code></li>
              <li>Forward Stripe webhooks: <code className="bg-gray-100 px-1">stripe listen --forward-to localhost:3000/api/webhooks/stripe</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
