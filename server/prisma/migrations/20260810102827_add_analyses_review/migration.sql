/*
  Warnings:

  - You are about to drop the column `approved_at` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `Analysis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_approved_by_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "approved_at",
DROP COLUMN "approved_by",
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by" INTEGER;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
