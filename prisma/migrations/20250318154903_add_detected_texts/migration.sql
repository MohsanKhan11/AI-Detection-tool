-- CreateTable
CREATE TABLE "DetectedText" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DetectedText_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetectedText" ADD CONSTRAINT "DetectedText_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
