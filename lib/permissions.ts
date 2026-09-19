import { prisma } from "@/lib/prisma";

export async function isCommitteeAdmin(userId: string, committeeId: string): Promise<boolean> {
  const membership = await prisma.committeeMember.findUnique({
    where: {
      committeeId_userId: {
        committeeId: committeeId,
        userId: userId,
      },
    },
  });

  if (!membership) return false;

  return membership.role === "ADMIN";
}