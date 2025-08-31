'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createProject({
  name,
  description,
  workspaceId,
}: {
  name: string;
  description?: string;
  workspaceId: string;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user has access to the workspace
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id,
          workspaceId,
        },
      },
    });

    if (!member) {
      return { success: false, error: 'Access denied' };
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
        createdById: session.user.id,
      },
    });

    revalidatePath('/dashboard/editor');
    return { success: true, project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject({
  id,
  name,
  description,
}: {
  id: string;
  name?: string;
  description?: string;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!project) {
      return { success: false, error: 'Project not found or access denied' };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    revalidatePath('/dashboard/editor');
    return { success: true, project: updatedProject };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function archiveProject(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      },
    });

    if (!project) {
      return { success: false, error: 'Project not found or insufficient permissions' };
    }

    await prisma.project.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });

    revalidatePath('/dashboard/editor');
    return { success: true };
  } catch (error) {
    console.error('Error archiving project:', error);
    return { success: false, error: 'Failed to archive project' };
  }
}