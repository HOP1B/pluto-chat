/*
  Warnings:

  - You are about to drop the column `credential` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "credential",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone_number" INTEGER;
