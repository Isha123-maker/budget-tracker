import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("No logged-in user found");
  }

  // Check if we already made a database User for this Clerk account
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // If not, create one — first time this person has ever logged in
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name: clerkUser.firstName ?? "New User",
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      },
    });
  }

  return dbUser;
}