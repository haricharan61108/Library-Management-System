/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `available` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Book` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `added_date` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `copies_available` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_copies` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_userId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id",
ADD COLUMN     "admin_id" SERIAL NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id");

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "available",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "added_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "book_id" SERIAL NOT NULL,
ADD COLUMN     "copies_available" INTEGER NOT NULL,
ADD COLUMN     "total_copies" INTEGER NOT NULL,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "role",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "registration_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Fine" (
    "fine_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "borrow_id" INTEGER NOT NULL,
    "fine_amount" DECIMAL(10,2) NOT NULL,
    "paid_status" BOOLEAN NOT NULL,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("fine_id")
);

-- CreateTable
CREATE TABLE "BorrowRequest" (
    "request_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "BorrowRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_picture" TEXT,
    "bio" TEXT,
    "contact_number" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "BorrowedBook" (
    "borrow_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "borrow_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "fine" DECIMAL(10,2),

    CONSTRAINT "BorrowedBook_pkey" PRIMARY KEY ("borrow_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "BorrowedBook"("borrow_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBook" ADD CONSTRAINT "BorrowedBook_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;
