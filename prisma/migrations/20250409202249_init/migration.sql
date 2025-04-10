/*
  Warnings:

  - You are about to drop the `BiometricKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BiometricKey" DROP CONSTRAINT "BiometricKey_userId_fkey";

-- DropTable
DROP TABLE "BiometricKey";

-- CreateTable
CREATE TABLE "PassKey" (
    "id" SERIAL NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "counter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PassKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassKey_userId_key" ON "PassKey"("userId");

-- AddForeignKey
ALTER TABLE "PassKey" ADD CONSTRAINT "PassKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
