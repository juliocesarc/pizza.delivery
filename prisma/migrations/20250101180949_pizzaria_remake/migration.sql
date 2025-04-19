/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `CategoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OptionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OptionValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OptionValueVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryItem" DROP CONSTRAINT "CategoryItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryItem" DROP CONSTRAINT "CategoryItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "OptionType" DROP CONSTRAINT "OptionType_productId_fkey";

-- DropForeignKey
ALTER TABLE "OptionValue" DROP CONSTRAINT "OptionValue_optionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OptionValueVariant" DROP CONSTRAINT "OptionValueVariant_optionValueId_fkey";

-- DropForeignKey
ALTER TABLE "OptionValueVariant" DROP CONSTRAINT "OptionValueVariant_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropIndex
DROP INDEX "OrderItem_orderId_idx";

-- DropIndex
DROP INDEX "OrderItem_productId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "isPaid",
DROP COLUMN "phone",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "maxFlavors" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "minFlavors" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "stock" DROP NOT NULL;

-- DropTable
DROP TABLE "CategoryItem";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "OptionType";

-- DropTable
DROP TABLE "OptionValue";

-- DropTable
DROP TABLE "OptionValueVariant";

-- DropTable
DROP TABLE "Variant";

-- CreateTable
CREATE TABLE "Flavor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Flavor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlavorToOrderItem" (
    "id" TEXT NOT NULL,
    "flavorId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,

    CONSTRAINT "FlavorToOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flavor" ADD CONSTRAINT "Flavor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlavorToOrderItem" ADD CONSTRAINT "FlavorToOrderItem_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "Flavor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlavorToOrderItem" ADD CONSTRAINT "FlavorToOrderItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
