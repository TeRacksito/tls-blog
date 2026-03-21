'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Data } from '@puckeditor/core';
import { Puck } from '@puckeditor/core';
import { puckConfig } from '@/lib/puck/puck-config';
import { DEFAULT_PUCK_DATA } from '@/lib/puck/default-page-data';
import '@puckeditor/core/puck.css';
import { fetchApi } from '@/lib/client-api/http-client';

interface PuckEditorProps {
  slug: string;
}

interface EditablePageResponse {
  page: {
    slug: string;
    title: string;
    content: Partial<Data>;
    isPublished: boolean;
    revision: number;
    updatedAt: string;
  };
}

export default function PuckEditor({ slug }: PuckEditorProps) {
  const [pageData, setPageData] = useState<Partial<Data>>(DEFAULT_PUCK_DATA);
  const [title, setTitle] = useState(slug);
  const [revision, setRevision] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const normalizedSlug = useMemo(() => slug.trim().toLowerCase(), [slug]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setTitle(normalizedSlug);

        const pageResponse = await fetchApi(
          `/nextapi/editor/${normalizedSlug}`
        );

        if (pageResponse.status === 404) {
          setPageData(DEFAULT_PUCK_DATA);
          setRevision(0);
          setTitle(normalizedSlug);
          setIsPublished(false);
          return;
        }

        if (!pageResponse.ok) {
          throw new Error('Failed to load page data');
        }

        const pageJson: EditablePageResponse = await pageResponse.json();
        setTitle(pageJson.page.title);
        setPageData(pageJson.page.content);
        setRevision(pageJson.page.revision);
        setIsPublished(pageJson.page.isPublished);
      } catch (bootstrapError) {
        setError(
          bootstrapError instanceof Error
            ? bootstrapError.message
            : 'Unexpected bootstrap error'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [normalizedSlug]);

  const handlePublish = async (data: Partial<Data>) => {
    const response = await fetchApi(`/nextapi/editor/${normalizedSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content: data,
        revision,
        isPublished,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as {
        error?: string;
        currentRevision?: number;
      };

      if (
        response.status === 409 &&
        Number.isInteger(payload.currentRevision)
      ) {
        setRevision(payload.currentRevision ?? revision);
      }

      throw new Error(payload.error ?? 'Failed to save page');
    }

    const payload = (await response.json()) as {
      page: { revision: number; isPublished: boolean };
    };

    setRevision(payload.page.revision);
    setIsPublished(payload.page.isPublished);
    setPageData(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Loading editor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-900">
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Visual editor
            </p>
            <h1 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {normalizedSlug}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
              />
              Published
            </label>
            <a
              href={`/preview/${normalizedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              Open preview
            </a>
          </div>
        </div>
      </div>
      <Puck config={puckConfig} data={pageData} onPublish={handlePublish} />
    </div>
  );
}
