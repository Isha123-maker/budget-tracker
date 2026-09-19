-- CreateEnum
CREATE TYPE "CommitteeRole" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "CommitteeMember" ADD COLUMN     "role" "CommitteeRole" NOT NULL DEFAULT 'MEMBER';
