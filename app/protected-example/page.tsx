'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Protected Example Page
 *
 * This page is only accessible to authenticated users.
 *
 * WARNING: This is a test page and will be deleted at some point.
 */
export default function ProtectedExamplePage() {
  return (
    <ProtectedRoute>
      <ProtectedExampleContent />
    </ProtectedRoute>
  );
}

function ProtectedExampleContent() {
  const { user, logout } = useAuth();
  const [apiData, setApiData] = useState<{
    message: string;
    data: {
      text: string;
      timestamp: string;
      info: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/nextapi/example', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setApiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Protected Example Page
        </h1>

        <div className="w-full max-w-2xl space-y-6">
          {/* User Info Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Authentication Info
            </h2>
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✓ Logged in as: <span className="font-bold">{user?.user}</span>
              </p>
            </div>
          </div>

          {/* API Data Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Protected API Response
            </h2>

            {isLoading ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Loading data from protected endpoint...
              </p>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error: {error}
                </p>
              </div>
            ) : apiData ? (
              <div className="space-y-4">
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {apiData.message}
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Message:
                    </span>{' '}
                    {apiData.data.text}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Timestamp:
                    </span>{' '}
                    {new Date(apiData.data.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Info:
                    </span>{' '}
                    {apiData.data.info}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Info Card */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              How This Works
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>This page is protected by the ProtectedRoute component</li>
              <li>The /nextapi/example endpoint is protected by the proxy</li>
              <li>Both require a valid authentication token to access</li>
              <li>
                If your session expires, you&apos;ll be prompted to login again
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              ← Back to Home
            </Link>
            <button
              onClick={logout}
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
