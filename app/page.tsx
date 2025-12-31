'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ConnectionTestData {
  id: number;
  title: string;
  description: string;
}

/**
 * Home Page
 *
 * This page displays authentication status and database connection test results.
 *
 * WARNING: This is a test page and will be deleted at some point.
 */
export default function Home() {
  const { user, isLoading, openLoginModal, logout } = useAuth();
  const [dbData, setDbData] = useState<ConnectionTestData | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDbData() {
      try {
        setDbLoading(true);
        const response = await fetch('/nextapi/db-test');

        if (!response.ok) {
          throw new Error('Failed to fetch database data');
        }

        const data = await response.json();
        setDbData(data);
      } catch (error) {
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setDbLoading(false);
      }
    }

    fetchDbData();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          TLS Web
        </h1>

        <div className="flex w-full max-w-4xl gap-8">
          {/* Authentication Status Card */}
          <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Authentication Status
            </h2>

            {isLoading ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Loading...
              </p>
            ) : user ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">Welcome back,</span>{' '}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {user.user}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ You are logged in
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/protected-example"
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Protected Example
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You are not logged in
                </p>
                <button
                  onClick={() => openLoginModal()}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Database Connection Test Card */}
          <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Database Connection Test
            </h2>

            {dbLoading ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Loading...
              </p>
            ) : dbError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                ✗ {dbError}
              </p>
            ) : dbData ? (
              <div className="space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">ID:</span> {dbData.id}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Title:</span> {dbData.title}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Description:</span>{' '}
                  {dbData.description}
                </p>
                <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Database connected successfully
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                ✗ No data found
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
