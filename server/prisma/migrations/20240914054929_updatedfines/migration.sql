/*
  Warnings:

  - The primary key for the `BorrowedBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `borrow_id` on the `BorrowedBook` table. All the data in the column will be lost.
  - The primary key for the `Fine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `borrow_id` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the column `fine_amount` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the column `fine_id` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the column `paid_status` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Fine` table. All the data in the column will be lost.
  - Added the required column `bookId` to the `Fine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrow_date` to the `Fine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fine` to the `Fine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_date` to the `Fine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Fine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_borrow_id_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_user_id_fkey";

-- AlterTable
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_pkey",
DROP COLUMN "borrow_id",
ADD COLUMN     "borrowId" SERIAL NOT NULL,
ADD CONSTRAINT "BorrowedBook_pkey" PRIMARY KEY ("borrowId");

-- AlterTable
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_pkey",
DROP COLUMN "borrow_id",
DROP COLUMN "fine_amount",
DROP COLUMN "fine_id",
DROP COLUMN "paid_status",
DROP COLUMN "user_id",
ADD COLUMN     "bookId" INTEGER NOT NULL,
ADD COLUMN     "borrow_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fine" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "return_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Fine_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
