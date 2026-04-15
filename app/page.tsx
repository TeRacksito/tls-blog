'use client';

import { useAuth } from '@/components/featured/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { HeadingPrimary } from '@/components/ui/heading_primary';
import { HeadingRoot } from '@/components/ui/heading_root';
import { Paragraph } from '@/components/ui/paragraph';
import { Surface } from '@/components/ui/surface';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuCheck, LuCross } from 'react-icons/lu';

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
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 p-8">
        {/* <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          TLS Web
        </h1> */}
        <Surface hasTextShadow>
          <HeadingRoot>TLS Web</HeadingRoot>
        </Surface>

        <div className="flex w-full max-w-4xl gap-8">
          {/* Authentication Status Card */}
          <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Authentication Status
            </h2> */}
            <HeadingPrimary className="mb-4">
              Authentication Status
            </HeadingPrimary>

            {isLoading ? (
              // <p className="text-sm text-zinc-600 dark:text-zinc-400">
              //   Loading...
              // </p>
              <Paragraph size="sm">Loading...</Paragraph>
            ) : user ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">Welcome back,</span>{' '}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {user.user}
                    </span>
                  </p> */}
                  <Paragraph size="sm" className="font-medium">
                    <Paragraph as="span" className="">
                      Welcome back,{' '}
                    </Paragraph>
                    <Paragraph as="span" className="font-semibold ">
                      {user.user}
                    </Paragraph>
                  </Paragraph>
                  {/* <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ You are logged in
                  </p> */}
                  <Paragraph size="sm" className="font-medium text-success">
                    <LuCheck className="inline" /> You are logged in
                  </Paragraph>
                </div>

                <div className="flex gap-3">
                  {/* <Link
                    href="/protected-example"
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Protected Example
                  </Link> */}
                  <Button asChild variant="default">
                    <Link href="/protected-example">Protected Example</Link>
                  </Button>
                  {/* <Link
                    href="/editor/home"
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Open Editor
                  </Link> */}
                  <Button asChild variant="default">
                    <Link href="/editor/home">Open Editor</Link>
                  </Button>
                  {/* <Link
                    href="/preview/home"
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Open Preview
                  </Link> */}
                  <Button asChild variant="outline">
                    <Link href="/preview/home">Open Preview</Link>
                  </Button>
                  {/* <button
                    onClick={logout}
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Logout
                  </button> */}
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You are not logged in
                </p> */}
                <Paragraph size="sm">You are not logged in</Paragraph>
                {/* <button
                  onClick={() => openLoginModal()}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Login
                </button> */}
                <Button onClick={() => openLoginModal()}>Login</Button>
              </div>
            )}
          </div>

          {/* Database Connection Test Card */}
          <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Database Connection Test
            </h2> */}
            <HeadingPrimary className="mb-4">
              Database Connection Test
            </HeadingPrimary>

            {dbLoading ? (
              // <p className="text-sm text-zinc-600 dark:text-zinc-400">
              //   Loading...
              // </p>
              <Paragraph size="sm">Loading...</Paragraph>
            ) : dbError ? (
              // <p className="text-sm text-red-600 dark:text-red-400">
              //   ✗ {dbError}
              // </p>
              <Paragraph size="sm" className="text-destructive">
                <LuCross className="inline" /> {dbError}
              </Paragraph>
            ) : dbData ? (
              <div className="space-y-2">
                {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">ID:</span> {dbData.id}
                </p> */}
                <Paragraph size="sm">
                  <Paragraph as="span" className="font-medium">
                    ID:
                  </Paragraph>{' '}
                  {dbData.id}
                </Paragraph>
                {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Title:</span> {dbData.title}
                </p> */}
                <Paragraph size="sm">
                  <Paragraph as="span" className="font-medium">
                    Title:
                  </Paragraph>{' '}
                  {dbData.title}
                </Paragraph>
                {/* <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Description:</span>{' '}
                  {dbData.description}
                </p> */}
                <Paragraph size="sm">
                  <Paragraph as="span" className="font-medium">
                    Description:
                  </Paragraph>{' '}
                  {dbData.description}
                </Paragraph>
                {/* <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Database connected successfully
                </p> */}
                <Paragraph size="sm" className="mt-4 font-medium text-success">
                  <LuCheck className="inline" /> Database connected successfully
                </Paragraph>
              </div>
            ) : (
              // <p className="text-sm text-red-600 dark:text-red-400">
              //   ✗ No data found
              // </p>
              <Paragraph size="sm" className="text-destructive">
                <LuCross className="inline" /> No data found
              </Paragraph>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
