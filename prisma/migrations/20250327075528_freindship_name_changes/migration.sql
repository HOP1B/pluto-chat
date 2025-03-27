/*
  Warnings:

  - You are about to drop the column `freindId` on the `Friendship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,friendId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_freindId_fkey";

-- DropIndex
DROP INDEX "Friendship_userId_freindId_key";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "freindId",
ADD COLUMN     "friendId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
