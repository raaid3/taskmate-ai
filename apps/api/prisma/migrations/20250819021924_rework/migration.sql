/*
  Warnings:

  - You are about to drop the column `daysOfWeek` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `TodoItem` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `TodoItem` table. All the data in the column will be lost.
  - Made the column `endTime` on table `TodoItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `TodoItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."TodoItem" DROP COLUMN "daysOfWeek",
DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "rrule" TEXT,
ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL;
