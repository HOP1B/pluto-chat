/*
  Warnings:

  - You are about to drop the column `status` on the `FreindRequest` table. All the data in the column will be lost.
  - You are about to drop the column `friendshipId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `recieverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_friendshipId_fkey";

-- AlterTable
ALTER TABLE "FreindRequest" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "friendshipId",
ADD COLUMN     "recieverId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FreindRequestStatus";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
