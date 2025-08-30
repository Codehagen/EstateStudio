import { PrismaClient } from "@/app/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  callbacks: {
    onSignUp: async ({ user }: { user: { id: string; email: string; name?: string | null } }) => {
      // Create a default workspace for the new user
      const workspaceName = user.name ? `${user.name}'s Workspace` : "My Workspace";
      const workspaceSlug = generateSlug(workspaceName, user.id);
      
      try {
        // Create workspace with user as owner
        const workspace = await prisma.workspace.create({
          data: {
            name: workspaceName,
            slug: workspaceSlug,
            ownerId: user.id,
            billingEmail: user.email,
            subscriptionTier: "FREE",
            monthlyEditLimit: 10,
            currentMonthEdits: 0,
          },
        });

        // Add user as workspace member with OWNER role
        await prisma.workspaceMember.create({
          data: {
            userId: user.id,
            workspaceId: workspace.id,
            role: "OWNER",
          },
        });

        // Create a default project in the workspace
        await prisma.project.create({
          data: {
            name: "My First Project",
            description: "Default project for organizing your photo edits",
            workspaceId: workspace.id,
            createdById: user.id,
            status: "ACTIVE",
          },
        });

        console.log(`Created workspace ${workspace.slug} for user ${user.email}`);
      } catch (error) {
        console.error("Error creating workspace for new user:", error);
        // Don't throw - allow signup to continue even if workspace creation fails
      }
    },
  },
});

// Helper function to generate a unique slug
function generateSlug(name: string, userId: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  // Add a portion of the user ID to ensure uniqueness
  const uniqueSuffix = userId.slice(-6).toLowerCase();
  return `${baseSlug}-${uniqueSuffix}`;
}

// Server-side session helper for Next.js
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session;
}
