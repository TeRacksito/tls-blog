import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

const MAX_CONTENT_BYTES = 250_000;

function normalizeSlug(rawSlug: string): string {
  return rawSlug.trim().toLowerCase();
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseContentSizeBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), 'utf-8');
}

function getAuthenticatedUsername(request: NextRequest): string | null {
  return request.headers.get('x-auth-user');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const username = getAuthenticatedUsername(request);

  if (!username) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const normalizedSlug = normalizeSlug(slug);

  if (!isValidSlug(normalizedSlug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const page = await prisma.editablePage.findUnique({
    where: { slug: normalizedSlug },
  });

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json({
    page: {
      slug: page.slug,
      title: page.title,
      content: page.content,
      isPublished: page.isPublished,
      revision: page.revision,
      updatedAt: page.updatedAt,
    },
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const username = getAuthenticatedUsername(request);

  if (!username) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const normalizedSlug = normalizeSlug(slug);

  if (!isValidSlug(normalizedSlug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const rawBody = await request.json();
  const title =
    typeof rawBody.title === 'string' && rawBody.title.trim().length > 0
      ? rawBody.title.trim()
      : normalizedSlug;
  const isPublished = Boolean(rawBody.isPublished);
  const revision = Number(rawBody.revision);
  const content = rawBody.content;

  if (!Number.isInteger(revision) || revision < 0) {
    return NextResponse.json({ error: 'Invalid revision' }, { status: 400 });
  }

  if (
    typeof content !== 'object' ||
    content === null ||
    Array.isArray(content)
  ) {
    return NextResponse.json(
      { error: 'Invalid page content' },
      { status: 400 }
    );
  }

  const contentSize = parseContentSizeBytes(content);

  if (contentSize > MAX_CONTENT_BYTES) {
    return NextResponse.json(
      { error: 'Content payload too large' },
      { status: 413 }
    );
  }

  const existingPage = await prisma.editablePage.findUnique({
    where: { slug: normalizedSlug },
  });

  if (existingPage && existingPage.revision !== revision) {
    return NextResponse.json(
      {
        error: 'Revision conflict',
        currentRevision: existingPage.revision,
      },
      { status: 409 }
    );
  }

  const now = new Date();
  const nextRevision = existingPage ? existingPage.revision + 1 : 1;

  const page = await prisma.editablePage.upsert({
    where: { slug: normalizedSlug },
    create: {
      slug: normalizedSlug,
      title,
      content,
      isPublished,
      revision: nextRevision,
      publishedAt: isPublished ? now : null,
      updatedBy: username,
    },
    update: {
      title,
      content,
      isPublished,
      revision: nextRevision,
      publishedAt: isPublished ? now : null,
      updatedBy: username,
    },
  });

  return NextResponse.json({
    success: true,
    page: {
      slug: page.slug,
      title: page.title,
      isPublished: page.isPublished,
      revision: page.revision,
      updatedAt: page.updatedAt,
    },
  });
}
