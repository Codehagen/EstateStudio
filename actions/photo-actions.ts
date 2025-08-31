'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getProjectEdits(workspaceId: string, projectId?: string) {
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

    const whereClause: any = {
      photo: {
        workspaceId,
      },
    };

    if (projectId) {
      whereClause.photo.projectId = projectId;
    }

    const edits = await prisma.photoEdit.findMany({
      where: whereClause,
      include: {
        photo: {
          select: {
            id: true,
            filename: true,
            url: true,
            projectId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 edits
    });

    return { success: true, edits };
  } catch (error) {
    console.error('Error fetching edits:', error);
    return { success: false, error: 'Failed to fetch edit history' };
  }
}

export async function getWorkspacePhotos(workspaceId: string, projectId?: string) {
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

    const whereClause: any = { workspaceId };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const photos = await prisma.photo.findMany({
      where: whereClause,
      include: {
        edits: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Get the latest edit for each photo
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return { success: true, photos };
  } catch (error) {
    console.error('Error fetching photos:', error);
    return { success: false, error: 'Failed to fetch photos' };
  }
}

export async function deletePhotoEdit(editId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user has access to the edit
    const edit = await prisma.photoEdit.findFirst({
      where: {
        id: editId,
        photo: {
          workspace: {
            members: {
              some: {
                userId: session.user.id,
                role: { in: ['OWNER', 'ADMIN', 'EDITOR'] },
              },
            },
          },
        },
      },
    });

    if (!edit) {
      return { success: false, error: 'Edit not found or insufficient permissions' };
    }

    await prisma.photoEdit.delete({
      where: { id: editId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting edit:', error);
    return { success: false, error: 'Failed to delete edit' };
  }
}