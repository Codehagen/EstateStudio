import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PhotoEditorWrapper } from "@/components/PhotoEditorWrapper";

export default async function EditorPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Get user's workspace and projects
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      projects: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  // Create a default project if none exists
  let currentProject = workspace.projects[0];
  if (!currentProject) {
    currentProject = await prisma.project.create({
      data: {
        name: "Default Project",
        description: "Your first photo editing project",
        workspaceId: workspace.id,
        createdById: session.user.id,
      },
    });
  }

  // Get recent photo edits for the workspace
  const recentEdits = await prisma.photoEdit.findMany({
    where: {
      photo: {
        workspaceId: workspace.id,
      },
    },
    include: {
      photo: {
        select: {
          id: true,
          filename: true,
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="container mx-auto p-6">
      <PhotoEditorWrapper
        workspace={workspace}
        currentProject={currentProject}
        projects={workspace.projects}
        recentEdits={recentEdits}
        userId={session.user.id}
      />
    </div>
  );
}