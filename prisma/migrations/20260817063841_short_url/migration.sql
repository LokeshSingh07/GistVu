/*
  Warnings:

  - The primary key for the `Gist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Gist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.

*/
-- AlterTable
ALTER TABLE "Gist" DROP CONSTRAINT "Gist_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(6),
ADD CONSTRAINT "Gist_pkey" PRIMARY KEY ("id");
