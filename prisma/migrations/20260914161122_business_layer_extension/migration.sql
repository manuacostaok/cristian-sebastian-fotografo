-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BalanceStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "acceptedQuoteId" TEXT,
ADD COLUMN     "balanceStatus" "BalanceStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "depositAmount" DECIMAL(10,2),
ADD COLUMN     "depositPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalPrice" DECIMAL(10,2),
ADD COLUMN     "visibility" "EventVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "HomeConfig" ADD COLUMN     "showFeatured" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showTestimonials" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showUpcoming" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "nextActionAt" TIMESTAMP(3),
ADD COLUMN     "nextActionNote" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privateGalleryId" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "validUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateGallery" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventId" TEXT,
    "downloadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkZone_slug_key" ON "WorkZone"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateGallery_token_key" ON "PrivateGallery"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateGallery_eventId_key" ON "PrivateGallery"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_acceptedQuoteId_key" ON "Event"("acceptedQuoteId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_privateGalleryId_fkey" FOREIGN KEY ("privateGalleryId") REFERENCES "PrivateGallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_acceptedQuoteId_fkey" FOREIGN KEY ("acceptedQuoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateGallery" ADD CONSTRAINT "PrivateGallery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

