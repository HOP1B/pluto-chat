-- CreateEnum
CREATE TYPE "FreindRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "FreindRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recieverId" TEXT NOT NULL,
    "status" "FreindRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "FreindRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FreindRequest_senderId_recieverId_key" ON "FreindRequest"("senderId", "recieverId");

-- AddForeignKey
ALTER TABLE "FreindRequest" ADD CONSTRAINT "FreindRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreindRequest" ADD CONSTRAINT "FreindRequest_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
