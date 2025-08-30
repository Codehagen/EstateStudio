import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// Handle user signup and workspace creation
export async function handleUserSignup(user: { id: string; email: string; name?: string | null }) {
  console.log('🔥 handleUserSignup triggered for user:', {
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // Parse business data from the name field (temporary solution)
  let businessData: {
    firstName: string;
    lastName: string;
    companyName: string;
    organizationNumber: string;
  } | null = null;

  let displayName = "User";
  let workspaceName = "My Workspace";

  try {
    if (user.name) {
      // Try to parse as JSON (business signup)
      const parsed = JSON.parse(user.name);
      if (parsed && typeof parsed === 'object' && parsed.firstName && parsed.companyName) {
        businessData = parsed;
        displayName = `${businessData.firstName} ${businessData.lastName}`;
        workspaceName = businessData.companyName;
        console.log('📊 Parsed business data:', businessData);
      } else {
        throw new Error('Invalid business data format');
      }
    }
  } catch {
    // Not JSON, treat as regular name
    displayName = user.name || "User";
    workspaceName = `${displayName}'s Workspace`;
    console.log('📝 Using regular name format:', displayName);
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

    // Update user name to display name (clean up the JSON data)
    if (businessData) {
      console.log('👤 Updating user display name...');
      await prisma.user.update({
        where: { id: user.id },
        data: { name: displayName },
      });
      console.log('✅ User display name updated:', displayName);
    }

    console.log('🎉 Successfully created complete workspace setup for user:', user.email);
  } catch (error) {
    console.error("❌ Error creating workspace for new user:", {
      userEmail: user.email,
      userId: user.id,
      error: error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    // Don't throw - allow signup to continue even if workspace creation fails
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