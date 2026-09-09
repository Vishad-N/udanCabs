-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "passengerNames" TEXT[] DEFAULT ARRAY[]::TEXT[];
