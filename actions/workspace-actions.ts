"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function createWorkspaceForUser(businessData?: {
  firstName: string;
  lastName: string;
  companyName: string;
  organizationNumber: string;
}) {
  // Get the current session to get user info
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("No authenticated user found");
  }

  const user = session.user;
  
  console.log('🔥 createWorkspaceForUser triggered for user:', {
    id: user.id,
    email: user.email,
    name: user.name,
  });

  let displayName = "User";
  let workspaceName = "My Workspace";

  if (businessData) {
    displayName = `${businessData.firstName} ${businessData.lastName}`;
    workspaceName = businessData.companyName;
    console.log('📊 Using business data:', businessData);
  } else if (user.name) {
    displayName = user.name;
    workspaceName = `${displayName}'s Workspace`;
  }

  const workspaceSlug = generateSlug(workspaceName, user.id);
  
  console.log('📝 Preparing to create workspace:', {
    name: workspaceName,
    slug: workspaceSlug,
    ownerId: user.id,
  });
  
  try {
    // Create workspace with user as owner
    console.log('🏢 Creating workspace...');
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        slug: workspaceSlug,
        ownerId: user.id,
        billingEmail: user.email,
        // Include business information if available
        companyName: businessData ? businessData.companyName : workspaceName,
        vatNumber: businessData ? businessData.organizationNumber : null,
        subscriptionTier: "FREE",
        monthlyEditLimit: 10,
        currentMonthEdits: 0,
      },
    });
    console.log('✅ Workspace created successfully:', {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
    });

    // Add user as workspace member with OWNER role
    console.log('👥 Creating workspace member...');
    const member = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });
    console.log('✅ Workspace member created:', {
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role,
    });

    // Create a default project in the workspace
    console.log('📁 Creating default project...');
    const project = await prisma.project.create({
      data: {
        name: "My First Project",
        description: "Default project for organizing your photo edits",
        workspaceId: workspace.id,
        createdById: user.id,
        status: "ACTIVE",
      },
    });
    console.log('✅ Default project created:', {
      id: project.id,
      name: project.name,
      workspaceId: project.workspaceId,
    });

    // Update user name to display name if we have business data
    if (businessData) {
      console.log('👤 Updating user display name...');
      await prisma.user.update({
        where: { id: user.id },
        data: { name: displayName },
      });
      console.log('✅ User display name updated:', displayName);
    }

    console.log('🎉 Successfully created complete workspace setup for user:', user.email);
    
    return {
      success: true,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
    };
  } catch (error) {
    console.error("❌ Error creating workspace for new user:", {
      userEmail: user.email,
      userId: user.id,
      error: error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    throw new Error(`Failed to create workspace: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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