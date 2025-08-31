import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function EditorPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Get user's workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!workspace) {
    redirect("/dashboard");
  }

  // Always create a new project for a new property
  const today = new Date().toLocaleDateString('no-NO', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const newProject = await prisma.project.create({
    data: {
      name: `Ny eiendom - ${today}`,
      description: "Klikk for å endre adresse",
      workspaceId: workspace.id,
      createdById: session.user.id,
    },
  });

  // Redirect to the project-specific page
  redirect(`/dashboard/editor/${newProject.id}`);
}