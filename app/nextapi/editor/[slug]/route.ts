import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
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

interface EditablePageSnapshot {
  slug: string;
  title: string;
  isPublished: boolean;
  revision: number;
  updatedAt: Date;
}

interface SaveEditablePageInput {
  slug: string;
  title: string;
  content: object;
  isPublished: boolean;
  revision: number;
  username: string;
}

interface SaveEditablePageResult {
  page?: EditablePageSnapshot;
  conflictRevision?: number;
  invalidInitialRevision?: boolean;
}

function mapPageSnapshot(page: EditablePageSnapshot): EditablePageSnapshot {
  return {
    slug: page.slug,
    title: page.title,
    isPublished: page.isPublished,
    revision: page.revision,
    updatedAt: page.updatedAt,
  };
}

async function saveEditablePage(
  input: SaveEditablePageInput
): Promise<SaveEditablePageResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const now = new Date();
      const existingPage = await tx.editablePage.findUnique({
        where: { slug: input.slug },
      });

      if (!existingPage) {
        if (input.revision !== 0) {
          return {
            invalidInitialRevision: true,
            conflictRevision: 0,
          };
        }

        const createdPage = await tx.editablePage.create({
          data: {
            slug: input.slug,
            title: input.title,
            content: input.content,
            isPublished: input.isPublished,
            revision: 1,
            publishedAt: input.isPublished ? now : null,
            updatedBy: input.username,
          },
        });

        return {
          page: mapPageSnapshot(createdPage),
        };
      }

      const nextRevision = existingPage.revision + 1;
      const updateResult = await tx.editablePage.updateMany({
        where: {
          slug: input.slug,
          revision: input.revision,
        },
        data: {
          title: input.title,
          content: input.content,
          isPublished: input.isPublished,
          revision: nextRevision,
          publishedAt: input.isPublished ? now : null,
          updatedBy: input.username,
        },
      });

      if (updateResult.count === 0) {
        const latestPage = await tx.editablePage.findUnique({
          where: { slug: input.slug },
          select: { revision: true },
        });

        return {
          conflictRevision: latestPage?.revision ?? existingPage.revision,
        };
      }

      const updatedPage = await tx.editablePage.findUnique({
        where: { slug: input.slug },
      });

      if (!updatedPage) {
        throw new Error('Unable to read saved page after update');
      }

      return {
        page: mapPageSnapshot(updatedPage),
      };
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const latestPage = await prisma.editablePage.findUnique({
        where: { slug: input.slug },
        select: { revision: true },
      });

      return {
        conflictRevision: latestPage?.revision ?? 0,
      };
    }

    throw error;
  }
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
  const content = rawBody.content as unknown;

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

  const saveResult = await saveEditablePage({
    slug: normalizedSlug,
    title,
    content,
    isPublished,
    revision,
    username,
  });

  if (saveResult.invalidInitialRevision) {
    return NextResponse.json(
      {
        error: 'Revision conflict',
        currentRevision: 0,
      },
      { status: 409 }
    );
  }

  if (!saveResult.page) {
    return NextResponse.json(
      {
        error: 'Revision conflict',
        currentRevision: saveResult.conflictRevision,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    success: true,
    page: {
      slug: saveResult.page.slug,
      title: saveResult.page.title,
      isPublished: saveResult.page.isPublished,
      revision: saveResult.page.revision,
      updatedAt: saveResult.page.updatedAt,
    },
  });
}
