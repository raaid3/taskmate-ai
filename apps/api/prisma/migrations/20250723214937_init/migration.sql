/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `isRecurring` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceRule` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "TodoItem" DROP COLUMN "endDateTime",
DROP COLUMN "isRecurring",
DROP COLUMN "recurrenceRule",
DROP COLUMN "startDateTime",
ADD COLUMN     "daysOfWeek" TEXT[],
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "start" TIMESTAMP(3),
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";
