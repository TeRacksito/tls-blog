-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'BUILDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "worldname" TEXT,
    "mapname" TEXT,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "z" DOUBLE PRECISION,
    "zoom" INTEGER,
    "coverImage" TEXT,
    "tags" TEXT[],
    "ownerUsername" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "minecraftId" TEXT,
    "category" TEXT,
    "stackSize" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneResource" (
    "milestoneId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "targetQuantity" INTEGER NOT NULL,
    "currentQuantity" INTEGER NOT NULL DEFAULT 0,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilestoneResource_pkey" PRIMARY KEY ("milestoneId","resourceId")
);

-- CreateTable
CREATE TABLE "EditablePage" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "updatedBy" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditablePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_ownerUsername_status_createdAt_worldname_idx" ON "Project"("ownerUsername", "status", "createdAt", "worldname");

-- CreateIndex
CREATE INDEX "Milestone_projectId_order_idx" ON "Milestone"("projectId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceItem_name_key" ON "ResourceItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceItem_minecraftId_key" ON "ResourceItem"("minecraftId");

-- CreateIndex
CREATE INDEX "ResourceItem_name_idx" ON "ResourceItem"("name");

-- CreateIndex
CREATE INDEX "ResourceItem_minecraftId_idx" ON "ResourceItem"("minecraftId");

-- CreateIndex
CREATE INDEX "ResourceItem_category_idx" ON "ResourceItem"("category");

-- CreateIndex
CREATE INDEX "MilestoneResource_resourceId_idx" ON "MilestoneResource"("resourceId");

-- CreateIndex
CREATE INDEX "MilestoneResource_milestoneId_fulfilled_idx" ON "MilestoneResource"("milestoneId", "fulfilled");

-- CreateIndex
CREATE INDEX "MilestoneResource_fulfilled_milestoneId_idx" ON "MilestoneResource"("fulfilled", "milestoneId");

-- CreateIndex
CREATE INDEX "MilestoneResource_milestoneId_targetQuantity_currentQuantit_idx" ON "MilestoneResource"("milestoneId", "targetQuantity", "currentQuantity");

-- CreateIndex
CREATE UNIQUE INDEX "EditablePage_slug_key" ON "EditablePage"("slug");

-- CreateIndex
CREATE INDEX "EditablePage_isPublished_updatedAt_idx" ON "EditablePage"("isPublished", "updatedAt");

-- CreateIndex
CREATE INDEX "EditablePage_updatedBy_updatedAt_idx" ON "EditablePage"("updatedBy", "updatedAt");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneResource" ADD CONSTRAINT "MilestoneResource_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneResource" ADD CONSTRAINT "MilestoneResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "ResourceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
