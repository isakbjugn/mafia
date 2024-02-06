/*
  Warnings:

  - Added the required column `photoHref` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoHref" TEXT NOT NULL;
