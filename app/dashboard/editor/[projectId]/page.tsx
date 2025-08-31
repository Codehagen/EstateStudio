import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PhotoEditorWrapper } from "@/components/PhotoEditorWrapper";

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectEditorPage({ params }: PageProps) {
  const { projectId } = await params;
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Get the specific project with workspace info
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!project) {
    redirect("/dashboard");
  }

  // Verify user has access to this project
  const hasAccess = project.workspace.members.some(
    member => member.userId === session.user.id
  );

  if (!hasAccess) {
    redirect("/dashboard");
  }

  // Get photos and edits for this specific project
  const photos = await prisma.photo.findMany({
    where: {
      projectId: project.id,
    },
    include: {
      edits: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-6">
      <PhotoEditorWrapper
        workspace={project.workspace}
        project={project}
        projectPhotos={photos}
        userId={session.user.id}
      />
    </div>
  );
}