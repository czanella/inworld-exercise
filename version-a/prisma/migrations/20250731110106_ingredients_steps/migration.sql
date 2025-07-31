/*
  Warnings:

  - You are about to drop the column `content` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "content",
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "steps" TEXT[];
