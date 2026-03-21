import { notFound } from 'next/navigation';
import { Render } from '@puckeditor/core/rsc';
import type { Data } from '@puckeditor/core';
import { prisma } from '@/prisma/prisma-client';
import { puckConfig } from '@/lib/puck/puck-config';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.trim().toLowerCase();

  const page = await prisma.editablePage.findFirst({
    where: {
      slug: normalizedSlug,
      isPublished: true,
    },
    select: {
      content: true,
      title: true,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <Render config={puckConfig} data={page.content as unknown as Data} />
    </main>
  );
}
