-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "answer" TEXT,
ADD COLUMN     "answeredAt" TIMESTAMP(3),
ADD COLUMN     "answeredMeta" JSONB;
